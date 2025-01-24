import { api } from '$lib/constants';

export const metadata = $state(
	fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json())
);

export const searchIndex = $state(fetch(`${api}/json/search-index.json`).then((r) => r.json()));
