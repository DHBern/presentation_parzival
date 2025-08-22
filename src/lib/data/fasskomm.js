import { api } from '$lib/constants';

export const fasskomm = fetch(`${api}/json/commentary.json`).then((r) => {
	return r.json();
});