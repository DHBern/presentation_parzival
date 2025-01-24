<script>
	import { onMount } from 'svelte';
	import { minisearch } from '$lib/minisearch.svelte';
	import { slide } from 'svelte/transition';
	import { processTerm, siglaFromHandle } from '$lib/functions';
	import Datatable from './Datatable.svelte';
	import { searchIndexFassung, searchIndexWitness } from '$lib/data.svelte';
	import { RadioGroup, RadioItem, SlideToggle } from '@skeletonlabs/skeleton';
	let docsAdded = $state(!!minisearch.documentCount);
	let searchtext = $state('');
	let exact = $state(true);
	let korpus = $state('fassungen');
	let docs = $derived.by(async () =>
		korpus === 'fassungen' ? (await searchIndexFassung).docs : (await searchIndexWitness).docs
	);
	/**
	 * @type {Promise<import("minisearch").SearchResult[]>}
	 */
	let searchResults = $state(new Promise((resolve) => resolve([])));
	onMount(() => {
		if (!minisearch.documentCount) {
			docs.then((d) => {
				minisearch.addAllAsync(d, { chunkSize: 50000 }).then(() => {
					docsAdded = true;
				});
			});
		}
	});

	const changeKorpus = () => {
		minisearch.removeAll();
		docsAdded = false;
		docs.then((d) => {
			minisearch.addAllAsync(d, { chunkSize: 50000 }).then(() => {
				docsAdded = true;
			});
		});
	};

	const search = async (/** @type {import("minisearch").Query} */ query) => {
		let results = minisearch.search(query, { fuzzy: exact ? 0 : 0.3 });
		results = await Promise.all(
			results.map(async (r) => {
				r.humanReadableSigil = await siglaFromHandle(r.sigla);
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
		capture: () => ({ searchtext, exact, searchResults, korpus }),
		restore: (v) => {
			searchtext = v.searchtext;
			exact = v.exact;
			searchResults = v.searchResults;
			korpus = v.korpus;
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
			<SlideToggle active="bg-primary-500" name="exact" bind:checked={exact}
				>{exact ? 'exakte' : 'fuzzy'} Suche</SlideToggle
			>
			<RadioGroup active="variant-filled-primary">
				<RadioItem
					bind:group={korpus}
					name="korpus"
					value={'fassungen'}
					onchange={() => changeKorpus()}
				>
					Fassungen
				</RadioItem>
				<RadioItem
					bind:group={korpus}
					name="korpus"
					value={'textzeugen'}
					onchange={() => changeKorpus()}
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
