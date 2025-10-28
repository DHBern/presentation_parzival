import { verses } from '$lib/data/verses';

/**
 * Generate all 827 Dreissiger with 1-30 verses for all sigla
 * @param {boolean} sigla
 * @returns {Promise<Array<{ sigla?: string, thirties: string, verse?: string }>>}
 */

export async function generateEntries(sigla) {
	/** @type {{verses: {thirties: string, verse: string}[]}} */
	if (sigla) {
		return await verses;
	} else {
		/** @type {{thirties: string, verse: string}[]} */
		let returnArray = [];
		let uniqueVerses = new Set();
		(await verses).forEach(
			(/** @type {{thirties: string, verse: string}} */ { thirties, verse }) => {
				const key = `${thirties}-${verse}`;
				if (!uniqueVerses.has(key)) {
					uniqueVerses.add(key);
					returnArray.push({ thirties, verse });
				}
			}
		);
		return returnArray;
	}
}
