import { api } from '$lib/constants';

export const metadata = fetch(`${api}/json/metadata-nomenclature.json`).then((r) => {
	return r.json();
});
