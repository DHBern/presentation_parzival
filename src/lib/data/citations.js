import { URL_STATIC_API } from '../constants.js';

/**
 * @typedef {{
 *   id: string,
 *   slug: string,
 *   citation_doi: string,
 *   citation_scope: string | null
 * }} Citation
 */

/** @param {unknown} data @returns {Citation[]} */
export function parseCitations(data) {
	if (!Array.isArray(data)) {
		throw new Error('Invalid citation registry: expected an array');
	}
	const ids = new Set();
	const slugs = new Set();
	return data.map((entry) => {
		if (
			!entry ||
			typeof entry.id !== 'string' ||
			!entry.id ||
			typeof entry.slug !== 'string' ||
			typeof entry.citation_doi !== 'string' ||
			!/^https:\/\/doi\.org\/10\.[^/\s]+\/\S+$/.test(entry.citation_doi) ||
			!(entry.citation_scope === null || typeof entry.citation_scope === 'string')
		) {
			throw new Error('Invalid citation registry entry');
		}
		if (ids.has(entry.id) || (entry.slug && slugs.has(entry.slug))) {
			throw new Error(`Ambiguous citation registry entry: ${entry.id}`);
		}
		ids.add(entry.id);
		if (entry.slug) slugs.add(entry.slug);
		return {
			id: entry.id,
			slug: entry.slug,
			citation_doi: entry.citation_doi,
			citation_scope: entry.citation_scope
		};
	});
}

/**
 * Empty slugs are deliberately excluded; project records require an explicit ID.
 * @param {Citation[]} citations
 * @param {{slug?: string, id?: string}} target
 */
export function findCitation(citations, { slug, id }) {
	return citations.find((entry) => (id ? entry.id === id : !!slug && entry.slug === slug));
}

/** @param {typeof fetch} fetcher @param {string} api */
export async function loadCitations(fetcher, api) {
	try {
		const response = await fetcher(`${api}/json/citations.json`);
		if (!response.ok) {
			throw new Error(`Citation registry request failed: ${response.status}`);
		}

		return { citations: parseCitations(await response.json()), citationsError: false };
	} catch (error) {
		console.error('Failed to load citation registry', error);
		return { citations: [], citationsError: true };
	}
}
export const citations = loadCitations(fetch, URL_STATIC_API);
