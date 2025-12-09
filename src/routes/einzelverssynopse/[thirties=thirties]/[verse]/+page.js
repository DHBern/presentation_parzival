import { redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

/** @type {import('./$types').PageLoad} */
export async function load({ params, data }) {
	const verseparts = params?.verse?.split('-');
	if (verseparts[0].length === 1) {
		console.log('Redirecting to zero-padded verse number');
		return redirect(302, `${base}/einzelverssynopse/${params.thirties}/0${params.verse}`);
	}
	return data;
}
