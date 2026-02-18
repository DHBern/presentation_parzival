import { URL_TEI_PB } from '$lib/constants';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	const res = await fetch(
		`${URL_TEI_PB}/parts/${params.handle}.xml/json?odd=parzival.odd&view=page&id=${params.handle}_${params.thirties}.${params.verse}`
	);

	const item = await res.json();

	return json(item, { status: res.status });
}

export const prerender = true;
