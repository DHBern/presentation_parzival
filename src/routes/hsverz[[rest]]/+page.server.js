import { metadata } from '$lib/data.svelte';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		sigla: await metadata
	};
}
