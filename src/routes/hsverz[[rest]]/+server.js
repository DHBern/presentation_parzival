import { base } from '$app/paths';
import { redirect } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function GET() {
	redirect(308, `${base}/textzeugen`);
}
