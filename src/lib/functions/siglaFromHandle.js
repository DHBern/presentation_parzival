import { metadata } from '$lib/data/metadata';

const { fragments, codices, hyparchetypes } = await metadata;
/**
 * @param {string} handle
 * @returns {string}
 */
export default function siglaFromHandle(handle) {
	/**@type {{fragments: {handle: String, sigil: String}[], codices: {handle: String, sigil: String}[]}} */
	if (handle.includes('fr')) {
		return fragments.find(({ handle: s }) => s === handle)?.sigil ?? handle;
	} else if (handle.includes('*')) {
		return hyparchetypes.find(({ handle: s }) => s === handle)?.sigil ?? handle;
	} else {
		return codices.find(({ handle: s }) => s === handle)?.sigil ?? handle;
	}
}
