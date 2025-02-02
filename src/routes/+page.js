import { api } from '$lib/constants';
import { metadata } from '$lib/data.svelte.js';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch }) {
	const { codices, fragments } = await metadata;
	return {
		tableData: await fetch(`${api}/json/contiguous_ranges.json`).then((res) => res.json()),
		codices,
		fragments
	};
}
