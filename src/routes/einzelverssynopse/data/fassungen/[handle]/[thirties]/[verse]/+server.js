import { URL_TEI_PB } from '$lib/constants';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	const res = await fetch(
		`${URL_TEI_PB}/parts/syn${params.thirties}.xml/json?odd=parzival.odd&view=single&xpath=//l[@n=%27${params.handle}%20${params.thirties}.${params.verse}%27]`
	);

	const item = await res.json();
	return json(item);
}
