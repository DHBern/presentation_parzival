<script>
	import { onMount } from 'svelte';
	import { minisearch } from '$lib/minisearch.svelte';
	import { api } from '$lib/constants';
	import { slide } from 'svelte/transition';
	import { siglaToHandle } from '$lib/functions';
	import Datatable from './Datatable.svelte';
	let docsAdded = $state(!!minisearch.documentCount);
	let searchtext = $state('');
	/**
	 * @type {import("minisearch").SearchResult[]}
	 */
	let searchResults = $state([]);
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

	const search = async (/** @type {import("minisearch").Query} */ query) => {
		let results = minisearch.search(query, { prefix: true });
		console.log(results);
		results = await Promise.all(
			results.map(async (r) => {
				r.humanReadableSigil = await siglaToHandle(r.sigla);
				const matches = Object.keys(r.match);
				const pos = r.content.toLowerCase().indexOf(matches[0]);
				//split content at pos and join with bold match
				r.content =
					r.content.slice(0, pos) +
					'<b>' +
					r.content.slice(pos, pos + matches[0].length) +
					'</b>' +
					r.content.slice(pos + matches[0].length);
				return r;
			})
		);
		return results;
	};
</script>

<section class="container mx-auto typography">
	<h1>Suche</h1>
	<p>Ein einleitender Text zur Suche</p>
</section>
<section class="container mx-auto">
	<form
		class="grid grid-cols-[4fr,1fr] gap-1 max-w-screen-md"
		onsubmit={() => {
			searchResults = search(searchtext);
		}}
	>
		<label transition:slide>
			<input
				class="input p-6 placeholder-primary-600"
				type="text"
				placeholder="Suchtext"
				bind:value={searchtext}
			/>
		</label>
		{#if docsAdded}
			<button class="btn variant-filled">Suchen</button>
		{:else}
			<button class="btn variant-filled-warning" disabled
				>Lade Suche <i class="ml-1 fa-solid fa-spinner fa-spin"></i></button
			>
		{/if}
	</form>
</section>
<section class="container mx-auto mt-4">
	{#await searchResults}
		<p>Suche läuft...</p>
	{:then r}
		{#if r.length != 0}
			<Datatable searchResults={r} />
		{/if}
	{/await}
</section>
