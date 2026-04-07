import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
	redirect(308, `${base}/transkriptionen/${params.rest}`);
}
