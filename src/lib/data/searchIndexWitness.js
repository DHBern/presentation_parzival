import { URL_STATIC_API } from '$lib/constants';

export default fetch(`${URL_STATIC_API}/json/search-index-transkript.json`)
	.then((r) => {
		return r.json();
	})
	.then((data) => data.docs);
