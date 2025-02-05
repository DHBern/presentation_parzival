<script>
	import { minisearches, processTerm } from '$lib/minisearch.svelte';
	import siglaFromHandle from '$lib/functions/siglaFromHandle';
	import Datatable from './Datatable.svelte';
	import { RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
	let hasDocuments = $state(!!minisearches[0].documentCount);
	let searchtext = $state('');
	let useExactSearch = $state(true);
	let corpus = $state('fassungen');
	let activeMinisearch = $derived.by(() => {
		switch (corpus) {
			case 'fassungen':
				return minisearches[0];
			case 'textzeugen':
				return minisearches[1];
			default:
				return minisearches[0];
		}
	});
	$effect(() => {
		if (!activeMinisearch.documentCount) {
			hasDocuments = false;
			let docs;
			switch (corpus) {
				case 'fassungen':
					docs = import('$lib/data/searchIndexFassung');
					break;
				case 'textzeugen':
					docs = import('$lib/data/searchIndexWitness');
					break;
				default:
					docs = import('$lib/data/searchIndexFassung');
			}
			docs
				.then((o) => o.default)
				.then((d) => {
					activeMinisearch.addAllAsync(d, { chunkSize: 50000 }).then(() => {
						hasDocuments = true;
					});
				});
		}
	});

	/**
	 * @type {Promise<import("minisearch").SearchResult[]>}
	 */
	let searchResults = $state(new Promise((resolve) => resolve([])));

	const handleSearch = async (/** @type {import("minisearch").Query} */ query) => {
		let results = activeMinisearch.search(query, { fuzzy: useExactSearch ? 0 : 0.3 });
		results = await Promise.all(
			/*
				Processes an array of search results, enriching each result with additional information:
				- Adds a human-readable sigil to each result based on its 'sigla' property.
				- Marks all matches in the content by wrapping them in <strong> tags.
			*/
			results.map(async (r) => {
				r.humanReadableSigil = r.sigla.includes('*') ? r.sigla : await siglaFromHandle(r.sigla);
				const matches = Object.keys(r.match);
				//Mark all matches in the content
				r.content = r.content
					.split(' ')
					.map((/** @type {string} */ c) => {
						if (matches.includes(processTerm(c))) {
							return `<mark>${c}</mark>`;
						}
						return c;
					})
					.join(' ');

				return r;
			})
		);
		return results;
	};

	export const snapshot = {
		capture: () => ({ searchtext, exact: useExactSearch, searchResults, korpus: corpus }),
		restore: (v) => {
			searchtext = v.searchtext;
			useExactSearch = v.exact;
			searchResults = Array.isArray(v.searchResults)
				? v.searchResults
				: new Promise((resolve) => resolve([]));
			corpus = v.korpus;
		}
	};
</script>

<section class="container mx-auto typography grid grid-cols-2 my-4 gap-8">
	<div>
		<h1>Suche</h1>
		<p>
			Durchsuchen Sie hier den kompletten Textkopus des Parzival. Standardmässig durchsuchen Sie die
			Fassungsverse und Ihnen werden nur genaue Treffer gezeigt. Dabei wurden einige
			Normalisierungen durchgeführt, so dass Ligaturen und andere Sonderformen auch in den Suchen
			gefunden werden. Die Suche nach Spigel enthält so zum Beispiel auch Treffer mit Schaft-S
			(ſpigel).
		</p>
	</div>
	<div>
		<h2 class="h2">Suchoptionen</h2>
		<div class="flex gap-2 items-center">
			<SlideToggle active="bg-primary-500" name="exact" bind:checked={useExactSearch}
				>{useExactSearch ? 'exakte' : 'fuzzy'} Suche</SlideToggle
			>
			<RadioGroup active="variant-filled-primary">
				<RadioItem bind:group={corpus} name="korpus" value={'fassungen'} disabled={!hasDocuments}>
					Fassungen
				</RadioItem>
				<RadioItem bind:group={corpus} name="korpus" value={'textzeugen'} disabled={!hasDocuments}>
					Textzeugen
				</RadioItem>
			</RadioGroup>
		</div>
	</div>
</section>
<section class="container mx-auto">
	<form
		class="grid grid-cols-[4fr,1fr] gap-1 max-w-screen-md"
		onsubmit={() => {
			searchResults = handleSearch(searchtext);
		}}
	>
		<label>
			<input
				class="input p-6 placeholder-primary-600"
				type="text"
				placeholder="Suchtext"
				bind:value={searchtext}
			/>
		</label>
		{#if hasDocuments}
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
			<Datatable searchResults={r} korpus={corpus} />
		{:else}
			<p>Keine Ergebnisse</p>
		{/if}
	{/await}
</section>

<style lang="postcss">
	:global(mark) {
		@apply bg-inherit;
		@apply font-bold;
		@apply text-inherit;
	}
</style>
