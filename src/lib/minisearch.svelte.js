import MiniSearch from 'minisearch';

/**
 * @param {string} term
 */
export function processTerm(term) {
	return term.normalize('NFKD').toLowerCase();
}

const miniSearchConfig = {
	fields: ['content_all', 'content', 'terms'],
	storeFields: ['content', 'content_all', 'verse', 'd', 'handle'],
	processTerm
};

// Create two instances of MiniSearch because there are two different indices
export const minisearches = Array(2)
	.fill('')
	.map(() => new MiniSearch(miniSearchConfig));
