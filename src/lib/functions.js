import { api } from '$lib/constants';

/**
 * Generate all 827 Dreissiger with 1-30 verses for all sigla
 * @param {boolean} sigla
 * @returns {Array<{ sigla?: string, thirties: string, verse?: string }>}
 */
export async function generateEntries(sigla) {
	const entryArray = [];
	if (sigla) {
		const { codices } = await fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json());
		const siglaArray = codices.map((codex) => codex.handle);
		for (/** @type string */ let sigla of siglaArray) {
			for (let thirties = 1; thirties <= 827; thirties++) {
				entryArray.push({
					sigla: sigla,
					thirties: `${thirties}`
				});
			}
		}
	} else {
		for (let thirties = 1; thirties <= 827; thirties++) {
			for (let verse = 1; verse <= 30; verse++) {
				entryArray.push({
					thirties: `${thirties}`,
					verse: `${verse}`
				});
			}
		}
	}

	return entryArray;
}
