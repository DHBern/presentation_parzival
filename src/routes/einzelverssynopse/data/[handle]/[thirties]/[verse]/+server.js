import { URL_TEI_PB } from '$lib/constants';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	const res = await fetch(
		`${URL_TEI_PB}/parts/${params.handle}.xml/json?odd=parzival.odd&view=page&id=${params.handle}_${params.thirties}.${params.verse.replaceAll('I', 'i')}`
	);

	const item = await res.json();

	// return json(item, { status: res.status });
	return json({
		format: 'json',
		view: 'page',
		doc: 'g.xml',
		root: null,
		rootNode: '3.4.2.253',
		id: 'g_2.11-ii',
		odd: 'parzival.odd',
		next: '3.4.2.475',
		previous: '3.4.2.164',
		nextId: 'g001v',
		previousId: 'g001r',
		switchView: '3.4.2',
		content:
			'<!DOCTYPE html>\n<div class="content "><div class="tei-l" id="g_2.11-ii">ſi entwichent vn<span class="tei-choice1">(de)</span> chernt.</div></div>',
		footnotes: '',
		userParams: { webcomponents: 7 },
		collection: ''
	});
}

export const prerender = true;
