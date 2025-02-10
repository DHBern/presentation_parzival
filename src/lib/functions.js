import { metadata } from './data.svelte.js';
import { api } from './constants.js';

/**
 * Generate all 827 Dreissiger with 1-30 verses for all sigla
 * @param {boolean} sigla
 * @returns {Promise<Array<{ sigla?: string, thirties: string, verse?: string }>>}
 */
export async function generateEntries(sigla) {
	const { verses } = await fetch(`${api}/json/metadata-ms-verses.json`).then((r) => r.json());
	if (sigla) {
		return verses;
	} else {
		/** @type {{thirties: string, verse: string}[]} */
		let returnArray = [];
		let uniqueVerses = new Set();
		verses.forEach((/** @type {{thirties: string, verse: string}} */ { thirties, verse }) => {
			const key = `${thirties}-${verse}`;
			if (!uniqueVerses.has(key)) {
				uniqueVerses.add(key);
				returnArray.push({ thirties, verse });
			}
		});
		return returnArray;
	}
}

/**@type {{fragments: {handle: String, sigil: String}[], codices: {handle: String, sigil: String}[]}} */
const { fragments, codices } = await metadata;

/**
 * @param {string} handle
 */
export function siglaFromHandle(handle) {
	if (handle.includes('fr')) {
		return fragments.find(({ handle: s }) => s === handle)?.sigil;
	} else {
		return codices.find(({ handle: s }) => s === handle)?.sigil;
	}
}

/**
 * @param {string} handle
 */
export function metadataFromHandle(handle) {
	if (handle.includes('fr')) {
		return fragments.find(({ handle: s }) => s === handle);
	} else {
		return codices.find(({ handle: s }) => s === handle);
	}
}
