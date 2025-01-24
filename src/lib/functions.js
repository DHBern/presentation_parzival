import { metadata } from './data.svelte.js';
import { api } from './constants.js';

/**
 * Generate all 827 Dreissiger with 1-30 verses for all sigla
 * @param {boolean} sigla
 * @returns {Promise<Array<{ sigla?: string, thirties: string, verse?: string }>>}
 */
export async function generateEntries(sigla) {
	/** @type {{verses: {thirties: string, verse: string}[]}} */
	const { verses } = await fetch(`${api}/json/metadata-ms-verses.json`).then((r) => r.json());
	if (sigla) {
		return verses;
	} else {
		/** @type {{thirties: string, verse: string}[]} */
		let returnArray = [];
		let uniqueVerses = new Set();
		verses.forEach(({ thirties, verse }) => {
			const key = `${thirties}-${verse}`;
			if (!uniqueVerses.has(key)) {
				uniqueVerses.add(key);
				returnArray.push({ thirties, verse });
			}
		});
		return returnArray;
	}
}

/**
 * @param {string} handle
 */
export async function siglaFromHandle(handle) {
	/**@type {{fragments: {handle: String, sigil: String}[], codices: {handle: String, sigil: String}[]}} */
	const { fragments, codices } = await metadata;
	if (handle.includes('fr')) {
		return fragments.find(({ handle: s }) => s === handle)?.sigil;
	} else {
		return codices.find(({ handle: s }) => s === handle)?.sigil;
	}
}

/**
 * @param {string} term
 */
export function processTerm(term) {
	return term.normalize('NFKD').toLowerCase();
}
