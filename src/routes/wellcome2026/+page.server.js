import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	return redirect(301, `https://parzdb.parzival.unibe.ch/wellcome2026/`);
}
