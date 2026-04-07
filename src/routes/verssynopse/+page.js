import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return redirect(302, `${base}/verssynopse/1/01`);
}
