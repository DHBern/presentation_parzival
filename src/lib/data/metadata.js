import { URL_STATIC_API } from '$lib/constants';

export const metadata = fetch(`${URL_STATIC_API}/json/metadata-nomenclature.json`).then((r) => {
	return r.json();
});
