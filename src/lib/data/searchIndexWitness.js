import { api } from '$lib/constants';

export default fetch(`${api}/json/search-index-transkript.json`)
	.then((r) => {
		return r.json();
	})
	.then((data) => data.docs);
