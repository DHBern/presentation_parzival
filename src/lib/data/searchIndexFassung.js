import { api } from '$lib/constants';

export default fetch(`${api}/json/search-index-fassung.json`)
	.then((r) => {
		return r.json();
	})
	.then((data) => data.docs);
