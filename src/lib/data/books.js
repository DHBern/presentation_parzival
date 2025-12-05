import { URL_STATIC_API } from '$lib/constants';

export const books = fetch(`${URL_STATIC_API}/json/books-by-dreissiger.json`).then((r) => {
	return r.json();
});
