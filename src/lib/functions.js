import { api } from '$lib/constants';

/**
 * Generate all 827 Dreissiger with 1-30 verses for all sigla
 * @param {boolean} sigla
 * @returns {Array<{ sigla?: string, thirties: string, verse?: string }>}
 */
export async function generateEntries(sigla) {
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
