import { metadata } from '$lib/data/metadata';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		sigla: await metadata
	};
}
