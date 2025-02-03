import MiniSearch from 'minisearch';

/**
 * @param {string} term
 */
export function processTerm(term) {
	return term.normalize('NFKD').toLowerCase();
}

export const minisearch = new MiniSearch({
	fields: ['content_all', 'content', 'terms'],
	storeFields: ['content', 'verse', 'd', 'sigla'],
	processTerm
});
