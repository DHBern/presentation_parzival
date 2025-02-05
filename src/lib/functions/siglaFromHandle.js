import { metadata } from '../data';

/**
 * @param {string} handle
 */
export default async function siglaFromHandle(handle) {
	/**@type {{fragments: {handle: String, sigil: String}[], codices: {handle: String, sigil: String}[]}} */
	const { fragments, codices } = await metadata;
	if (handle.includes('fr')) {
		return fragments.find(({ handle: s }) => s === handle)?.sigil;
	} else {
		return codices.find(({ handle: s }) => s === handle)?.sigil;
	}
}
