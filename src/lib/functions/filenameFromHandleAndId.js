/**
 * @param {string} handle
 * @returns {string}
 * @param {string} id
 */
export default function filenameFromHandleAndId(handle, id) {
	if (handle.startsWith('fr')) {
		return id.replace(handle, `${handle.replace('fr', '').padStart(3, '0')}_`);
	}
	return id;
}
