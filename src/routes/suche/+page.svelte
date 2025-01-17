<script>
	import { api } from '$lib/constants';
	import { minisearch } from '$lib/minisearch.svelte';
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	let allDocsAdded;

	$effect(() => {
		if (!minisearch.documentCount) {
			console.log('fetching search index');
			fetch(`${api}/json/search-index.json`)
				.then((r) => r.json())
				.then((index) => {
					allDocsAdded = /** @type {Promise<void>} */ (
						new Promise((resolve) => {
							minisearch.addAllAsync(index.docs, { chunkSize: 50000 }).then(() => {
								console.log(minisearch.search('parzival'));
								resolve();
							});
						})
					);
				});
		}
	});
</script>
