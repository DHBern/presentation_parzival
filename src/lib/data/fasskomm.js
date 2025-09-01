import { URL_STATIC_API } from '$lib/constants';

export const fasskomm = fetch(`${URL_STATIC_API}/json/commentary.json`).then((r) => {
	return r.json();
});
