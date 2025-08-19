import { URL_STATIC_API } from '$lib/constants';
import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const { codices, fragments } = await metadata;
	return {
		tableData: await fetch(`${URL_STATIC_API}/json/contiguous_ranges.json`).then((res) =>
			res.json()
		),
		codices,
		fragments
	};
}
