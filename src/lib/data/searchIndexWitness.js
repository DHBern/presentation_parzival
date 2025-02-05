import { api } from '$lib/constants';

export default fetch(`${api}/json/search-index-fassung.json`)
	.then((r) => {
		console.log('fetching SearchIndexWitness, this should only happen once');
		return r.json();
	})
	.then((data) => data.docs);
