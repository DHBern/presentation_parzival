import { metadata } from '$lib/data/metadata';

const { fragments, codices, hyparchetypes } = await metadata;
/**
 * @param {string} sigil
 * @returns {string}
 */
export default function handleFromSigla(sigil) {
	/**@type {{fragments: {handle: String, sigil: String}[], codices: {handle: String, sigil: String}[]}} */
	if (sigil.includes('Fr')) {
		return fragments.find(({ sigil: s }) => s.endsWith(sigil.split('Fr')[1]))?.handle ?? sigil; // Splitting the sigil to just get the fragment number might produce false results, but we don't need to use a regex
	} else if (sigil.includes('*')) {
		return hyparchetypes.find(({ sigil: s }) => s === sigil)?.handle ?? sigil;
	} else {
		return codices.find(({ sigil: s }) => s === sigil)?.handle ?? sigil;
	}
}
