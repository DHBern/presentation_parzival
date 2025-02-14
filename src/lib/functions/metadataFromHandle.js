import { metadata } from '$lib/data/metadata';

/**@type {{fragments: {handle: String, sigil: String}[], codices: {handle: String, sigil: String}[]}} */
const { fragments, codices } = await metadata;

/**
 * @param {string} handle
 */

export default function metadataFromHandle(handle) {
	if (handle.includes('fr')) {
		return fragments.find(({ handle: s }) => s === handle);
	} else {
		return codices.find(({ handle: s }) => s === handle);
	}
}
