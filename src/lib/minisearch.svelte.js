import MiniSearch from 'minisearch';

export const minisearch = new MiniSearch({
	fields: ['sigla', 'content_all', 'id', 'verse', 'content'],
	idField: 'id'
});
