import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return redirect(302, `https://parzdb.parzival.unibe.ch/wellcome2026/`);
}
