import { json } from '@sveltejs/kit';
import { NUMBER_OF_PAGES, URL_TEI_PB, URL_STATIC_API } from '$lib/constants';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const { hyparchetypes } = await metadata;
	const apparatus = await fetch(`${URL_STATIC_API}/json/syn/syn${params.thirties}.json`);
	if (!apparatus.ok) {
		console.log('Failed to fetch apparatus', apparatus);
	}
	const apparatusData = (await apparatus.json()).versions;
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
			...apparatusData.find((/** @type {{ handle: string; }} */ a) => a.handle === h.handle)
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
