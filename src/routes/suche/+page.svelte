<script>
	import { onMount } from 'svelte';
	import { minisearch, processTerm } from '$lib/minisearch.svelte';
	import siglaFromHandle from '$lib/functions/siglaFromHandle';
	import Datatable from './Datatable.svelte';
	import { RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
	let hasDocuments = $state(!!minisearch.documentCount);
	let searchtext = $state('');
	let useExactSearch = $state(true);
	let corpus = $state('fassungen');
	let docs = $derived.by(async () => {
		switch (corpus) {
			case 'fassungen':
				return (await import('$lib/data/searchIndexFassung')).default;
			case 'textzeugen':
				return (await import('$lib/data/searchIndexWitness')).default;
			default:
				return [];
		}
	});

	/**
	 * @type {Promise<import("minisearch").SearchResult[]>}
	 */
	let searchResults = $state(new Promise((resolve) => resolve([])));
	onMount(() => {
		if (!hasDocuments) {
			docs.then((d) => {
				minisearch.addAllAsync(d, { chunkSize: 50000 }).then(() => {
					hasDocuments = true;
				});
			});
		}
	});

	const changeKorpus = () => {
		minisearch.removeAll();
		hasDocuments = false;
		docs.then((d) => {
			minisearch.addAllAsync(d, { chunkSize: 50000 }).then(() => {
				hasDocuments = true;
			});
		});
	};

	const handleSearch = async (/** @type {import("minisearch").Query} */ query) => {
		let results = minisearch.search(query, { fuzzy: useExactSearch ? 0 : 0.3 });
		results = await Promise.all(
			results.map(async (r) => {
				r.humanReadableSigil = r.sigla.includes('*') ? r.sigla : await siglaFromHandle(r.sigla);
				const matches = Object.keys(r.match);
				//Mark all matches in the content
				r.content = r.content
					.split(' ')
					.map((/** @type {string} */ c) => {
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
				<RadioItem
					bind:group={corpus}
					name="korpus"
					value={'fassungen'}
					onchange={() => changeKorpus()}
					disabled={!hasDocuments}
				>
					Fassungen
				</RadioItem>
				<RadioItem
					bind:group={corpus}
					name="korpus"
					value={'textzeugen'}
					onchange={() => changeKorpus()}
					disabled={!hasDocuments}
				>
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
