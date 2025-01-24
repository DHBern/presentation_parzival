<script>
	import { onMount } from 'svelte';
	import { minisearch } from '$lib/minisearch.svelte';
	import { slide } from 'svelte/transition';
	import { processTerm, siglaToHandle } from '$lib/functions';
	import Datatable from './Datatable.svelte';
	import { searchIndex } from '$lib/data.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';
	let docsAdded = $state(!!minisearch.documentCount);
	let searchtext = $state('');
	let exact = $state(true);
	/**
	 * @type {Promise<import("minisearch").SearchResult[]>}
	 */
	let searchResults = $state([]);
	onMount(async () => {
		if (!minisearch.documentCount) {
			const { docs } = await searchIndex;
			minisearch.addAllAsync(docs, { chunkSize: 50000 }).then(() => {
				docsAdded = true;
			});
		}
	});

	const search = async (/** @type {import("minisearch").Query} */ query) => {
		let results = minisearch.search(query, { fuzzy: exact ? 0 : 0.3 });
		results = await Promise.all(
			results.map(async (r) => {
				r.humanReadableSigil = await siglaToHandle(r.sigla);
				const matches = Object.keys(r.match);
				//Mark all matches in the content
				r.content = r.content
					.split(' ')
					.map((c) => {
						if (matches.includes(processTerm(c))) {
							return `<strong>${c}</strong>`;
						}
						return c;
					})
					.join(' ');

				return r;
			})
		);
		return results;
	};
</script>

<section class="container mx-auto typography">
	<div>
		<h1>Suche</h1>
		<p>Ein einleitender Text zur Suche</p>
	</div>
	<div>
		<h2>Suchoptionen</h2>
		<SlideToggle active="bg-primary-500" name="exact" bind:checked={exact}
			>{exact ? 'exakte' : 'fuzzy'} Suche</SlideToggle
		>
	</div>
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
		{:else}
			<p>Keine Ergebnisse</p>
		{/if}
	{/await}
</section>
