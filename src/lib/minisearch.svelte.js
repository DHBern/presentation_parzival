import MiniSearch from 'minisearch';

export const minisearch = new MiniSearch({
	fields: ['content_all', 'id', 'content', 'terms'],
	storeFields: ['content', 'verse', 'd', 'sigla'],
	idField: 'id'
});
