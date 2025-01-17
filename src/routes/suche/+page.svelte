<script>
	import { onMount } from 'svelte';
	import { minisearch } from '$lib/minisearch.svelte';
	import { api } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import Datatable from './Datatable.svelte';
	let docsAdded = $state(!!minisearch.documentCount);
	let searchtext = $state('');
	let searchResults = $derived.by(() => {
		if (searchtext && docsAdded) {
			console.log('searching');
			const minisearchResults = minisearch.search(searchtext);
			// derive sigla, thirties, verse from id
			return minisearchResults.map((r) => {
				const [, sigla, thirties, verse] = r.id.match(/([^_]+)_([^\.]+)\.(.+)/);
				return { sigla, thirties, verse, content: r.content };
			});
		}
		console.log('no search results');
		return [];
	});
	onMount(async () => {
		if (!minisearch.documentCount) {
			console.log('fetching and adding docs');
			const { docs } = await fetch(`${api}/json/search-index.json`).then((r) => r.json());
			minisearch.addAllAsync(docs, { chunkSize: 50000 }).then(() => {
				console.log('all documents added');
				docsAdded = true;
			});
		}
	});
</script>

<section class="container mx-auto typography">
	<h1>Suche</h1>
	<p>Ein einleitender Text zur Suche</p>
</section>
<section>
	<label transition:slide>
		<input
			class="input p-6 placeholder-primary-600"
			type="text"
			placeholder="Suchtext"
			bind:value={searchtext}
		/>
	</label>
</section>
<section>
	<Datatable {searchResults} />
</section>
