import { api } from '$lib/constants';

export const metadata = $state(
	fetch(`${api}/json/metadata-nomenclature.json`).then((r) => r.json())
);
