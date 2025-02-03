import { metadata } from '$lib/data';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return {
		sigla: await metadata
	};
}
