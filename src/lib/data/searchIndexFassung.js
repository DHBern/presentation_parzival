import { api } from '$lib/constants';

export default fetch(`${api}/json/search-index-transkript.json`)
	.then((r) => {
		console.log('fetching SearchIndexFassunge, this should only happen once');
		return r.json();
	})
	.then((data) => data.docs);
