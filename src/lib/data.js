import { api } from '$lib/constants';

export const metadata = fetch(`${api}/json/metadata-nomenclature.json`).then((r) => {
	console.log('fetching metadata, this should only happen once');
	return r.json();
});
