import { json } from '@sveltejs/kit';
import { NUMBER_OF_PAGES, URL_TEI_PB, URL_STATIC_API } from '$lib/constants';
import { metadata } from '$lib/data/metadata';
import { fasskomm } from '$lib/data/fasskomm';
import { base } from '$app/paths';
import handleFromSigil from '$lib/functions/handleFromSigil';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	// Import pre-fetched metadata and fasskomm that are not split into dreissiger
	const { hyparchetypes } = await metadata;
	const { commentary } = await fasskomm;

	// --------------------
	// Fassungskommentare
	// --------------------
	// fetch and restructure data
	let fasskommData = commentary
		.map(({ vers, ...rest }) => {
			let [dreissiger, verse] = vers.split('.');
			return { dreissiger, verse, ...rest };
		})
		.filter((item) => {
			return Number(item.dreissiger) === Number(params.thirties);
		});

	// --------------------
	// Apparatus
	// --------------------
	// Fetch from API
	const apparatus = await fetch(`${URL_STATIC_API}/json/syn/syn${params.thirties}.json`);
	if (!apparatus.ok) {
		console.log('Failed to fetch apparatus', apparatus);
	}
	let apparatusData = (await apparatus.json()).versions;

	// Populate Anchor Tags in apparatus
	function populateAnchorTags(string, verse) {
		return string.replace(/<a>(.*?)<\/a>/g, (_match, p1) => {
			return `<a href='${base}/textzeugen/${handleFromSigil(p1)}/${params.thirties}/${verse}'>${p1}</a>`;
		});
	}
	apparatusData.forEach((i) => {
		i.structure.forEach((item) => {
			for (let key in item) {
				item[key] = populateAnchorTags(item[key], key);
			}
		});
		i.reading.forEach((item) => {
			for (let key in item) {
				item[key] = populateAnchorTags(item[key], key);
			}
		});
	});

	// --------------------
	// Content (via TEI-Publisher)
	// --------------------
	const teipbData = hyparchetypes.map(async (h) => {
		const r = await fetch(
			`${URL_TEI_PB}/parts/syn${params.thirties}.xml/json?&view=single&odd=parzival-verse.odd&xpath=//div[@subtype=%27${h.handle.replace('*', '')}%27 and @type=%27Textteil%27]`
		);
		if (!r.ok) {
			console.log('Failed to fetch tpData', r);
			return false;
		}
		return {
			content: (await r.json()).content,
			// only use fasskomm and apparatus that match hyparchetype
			fasskomm: fasskommData.filter((/** @type {{ handle: string; }} */ f) =>
				f.fassung_targets.includes(h.handle.replace('*', ''))
			),
			apparat: apparatusData.find((/** @type {{ handle: string; }} */ a) => a.handle === h.handle)
		};
	});

	return json(await Promise.all(teipbData));
}

/** @type {import('./$types').EntryGenerator} */
export async function entries() {
	const entriesArray = Array.from({ length: NUMBER_OF_PAGES }, (_, i) => ({
		thirties: String(i + 1)
	}));
	return entriesArray;
}

export const prerender = true;
