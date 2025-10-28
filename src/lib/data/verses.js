import { URL_STATIC_API } from '$lib/constants';

export const verses = fetch(`${URL_STATIC_API}/json/metadata-ms-verses.json`)
	.then((r) => r.json())
	.then((data) => data.verses);
