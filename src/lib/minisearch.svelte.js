import MiniSearch from 'minisearch';
import { processTerm } from './functions';

export const minisearch = new MiniSearch({
	fields: ['content_all', 'content', 'terms'],
	storeFields: ['content', 'verse', 'd', 'sigla'],
	processTerm
});
