import { URL_TEI_PB } from '$lib/constants';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ fetch, params }) {
	const res = await fetch(
		`${URL_TEI_PB}/parts/${params.handle}.xml/json?odd=parzival.odd&view=page&id=${params.handle}_${params.thirties}.${params.verse}`
	);

	const item = await res.json();

	return json(item);

	// return json({
	// 	format: 'json',
	// 	view: 'page',
	// 	doc: 'd.xml',
	// 	root: null,
	// 	rootNode: '3.4.2.211',
	// 	id: 'd_1.02',
	// 	odd: 'parzival.odd',
	// 	next: '3.4.2.423',
	// 	previous: '3.4.2.198',
	// 	nextId: 'd006',
	// 	previousId: 'd005',
	// 	switchView: '3.4.2',
	// 	content:
	// 		'<!DOCTYPE html>\n<div class="content "><div class="tei-l" id="d_1.02">daz muͦz der ſele werden ſur</div></div>',
	// 	footnotes: '',
	// 	userParams: { webcomponents: 7 },
	// 	collection: ''
	// });
}
