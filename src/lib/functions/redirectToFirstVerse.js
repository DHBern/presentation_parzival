import { base } from '$app/paths';
import { URL_STATIC_API } from '$lib/constants';
import { error, redirect } from '@sveltejs/kit';

/**
 * @param {string} sigla
 * @param {typeof fetch} fetch
 * @param {URL} url
 * @returns {Promise<never>}
 */
export default async function redirectToFirstVerse(sigla, fetch, url) {
	const handles = sigla.split('-');
	const metadata = await Promise.all(
		handles.map(async (handle) => {
			const response = await fetch(`${URL_STATIC_API}/json/metadata-ms-page/${handle}.json`);
			if (!response.ok) error(502, `Failed to fetch page metadata for ${handle}`);
			const data = await response.json();
			if (!Array.isArray(data[handle])) error(502, `Invalid page metadata for ${handle}`);
			return data[handle];
		})
	);

	/** @type {Set<string>[]} */
	const versesByWitness = metadata.map(
		(pages) => new Set(pages.flatMap((/** @type {{l?: string[]}} */ page) => page.l ?? []))
	);

	/** @type {{ thirties: number, verse: number, id: string } | undefined} */
	let first;
	for (const id of versesByWitness[0]) {
		if (!versesByWitness.every((verses) => verses.has(id))) continue;
		const match = /^(\d+)\.(\d+[^.]*)$/.exec(id);
		if (!match) continue;
		const thirties = Number(match[1]);
		const verse = Number.parseInt(match[2], 10);
		if (
			!first ||
			thirties < first.thirties ||
			(thirties === first.thirties && verse < first.verse)
		) {
			first = { thirties, verse, id };
		}
	}

	if (!first) error(404, `No common verses found for ${sigla}`);
	redirect(308, `${base}/transkriptionen/${sigla}/${first.id.replace('.', '/')}${url.search}`);
}
