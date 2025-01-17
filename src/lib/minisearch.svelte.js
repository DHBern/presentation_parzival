import MiniSearch from 'minisearch';

export const minisearch = new MiniSearch({
	fields: ['content_all', 'id', 'content'],
	storeFields: ['content', 'verse', 'd', 'sigla'],
	idField: 'id'
});
