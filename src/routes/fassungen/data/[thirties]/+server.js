import { json } from '@sveltejs/kit';
import { NUMBER_OF_PAGES, teipb } from '$lib/constants';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch }) {
	const { hyparchetypes } = await metadata;
	const teipbData = hyparchetypes.map(async (h) => {
		const r = await fetch(
			`${teipb}/parts/syn${params.thirties}.xml/json?&view=single&odd=parzival-verse.odd&xpath=//div[@subtype=%27${h.handle.replace('*', '')}%27 and @type=%27Textteil%27]`
		);
		if (!r.ok) {
			console.log('Failed to fetch tpData', r);
			return false;
		}
		return (await r.json()).content;
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
