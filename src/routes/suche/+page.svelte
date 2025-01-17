<script>
	import { onMount } from 'svelte';
	import { minisearch } from '$lib/minisearch.svelte';
	import { api } from '$lib/constants';
	let docsAdded = $state(Promise.resolve(!minisearch.documentCount));
	onMount(async () => {
		if (!minisearch.documentCount) {
			console.log('fetching and adding docs');
			const { docs } = await fetch(`${api}/json/search-index.json`).then((r) => r.json());
			docsAdded = /** @type {Promise<boolean>} */ (
				new Promise((resolve) => {
					minisearch.addAllAsync(docs, { chunkSize: 50000 }).then(() => {
						console.log('all documents added');
						resolve(true);
					});
				})
			);
		}
	});
</script>

<button onclick={() => console.log(minisearch.search('feirefiz'))}>Log data</button>
