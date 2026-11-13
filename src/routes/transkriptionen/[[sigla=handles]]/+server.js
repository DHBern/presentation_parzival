import redirectToFirstVerse from '$lib/functions/redirectToFirstVerse';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, fetch, url }) {
	if (!params.sigla) error(404, 'No witness specified');
	return redirectToFirstVerse(params.sigla, fetch, url);
}
