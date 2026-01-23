<script>
	import { minisearches, processTerm } from '$lib/minisearch.svelte';
	import sigilFromHandle from '$lib/functions/sigilFromHandle';
	import Datatable from './Datatable.svelte';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	let hasDocuments = $state(!!minisearches[0].documentCount);
	let searchtext = $state('');
	let useExactSearch = $state(true);
	let corpus = $state('fassungen');
	let activeMinisearch = $derived.by(() => {
		switch (corpus) {
			case 'textzeugen':
				return minisearches[1];
			case 'fassungen':
			default:
				return minisearches[0];
		}
	});
	$effect(() => {
		if (!activeMinisearch.documentCount) {
			hasDocuments = false;
			// we don't use activeMinisearch here, because we want 100% certainty not to add docs to the wrong minisearch
			let miniSearchToAdd;
			let docs;
			switch (corpus) {
				case 'textzeugen':
					docs = import('$lib/data/searchIndexWitness');
					miniSearchToAdd = minisearches[1];
					break;
				case 'fassungen':
				default:
					docs = import('$lib/data/searchIndexFassung');
					miniSearchToAdd = minisearches[0];
			}
			docs
				.then((o) => o.default)
				.then((d) => {
					// due to the async nature of the import, the document count might have changed in the meantime, so we have to check again
					if (!miniSearchToAdd.documentCount) {
						miniSearchToAdd.addAllAsync(d, { chunkSize: 50000 }).then(() => {
							hasDocuments = true;
						});
					}
				});
		}
	});

	/**
	 * @type {Promise<import("minisearch").SearchResult[]>}
	 */
	let searchResults = $state(new Promise((resolve) => resolve([])));

	/**
	 * @param {string} base
	 * @param {string} compareTo
	 */
	function highlightDifferences(base, compareTo) {
		let result = '';
		let i = 0,
			j = 0;

		while (i < base.length) {
			if (j < compareTo.length && base[i] === compareTo[j]) {
				result += base[i];
				j++; // Move both pointers when characters match
			} else {
				result += `<span>${base[i]}</span>`; // Highlight extra characters
			}
			i++; // Always move pointer for base
		}

		return result;
	}

	const handleSearch = async (/** @type {import("minisearch").Query} */ query) => {
		let results = activeMinisearch.search(query, { fuzzy: useExactSearch ? 0 : 0.3 });
		results = await Promise.all(
			/*
				Processes an array of search results, enriching each result with additional information:
				- Adds a human-readable sigil to each result based on its 'handle' property.
				- Marks all matches in the content by wrapping them in <strong> tags.
			*/
			results.map((r) => {
				r.sigil = sigilFromHandle(r.handle);
				const matches = Object.keys(r.match);
				if (r.content_all !== r.content) {
					r.content_all = highlightDifferences(r.content_all, r.content);
				}
				//Mark all matches in the content
				r.content_all = r.content_all
					.split(' ')
					.map((/** @type {string} */ c) => {
						//if the matches include the processed term without punctuation, mark it
						if (
							matches.includes(
								processTerm(
									c
										.replaceAll('<span>', '')
										.replaceAll('</span>', '')
										.replaceAll(/[<>.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
								)
							)
						) {
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
	/**
	 * @type {import("minisearch").SearchResult[]}
	 */
	let searchResultArray = [];

	export const snapshot = {
		capture: () => ({ searchtext, useExactSearch, searchResultArray, corpus }),
		restore: (v) => {
			searchtext = v.searchtext;
			useExactSearch = v.useExactSearch;
			searchResults = new Promise((resolve) => resolve(v.searchResultArray));
			corpus = v.corpus;
		}
	};
</script>

<section class="container mx-auto typography grid sm:grid-cols-2 my-4 gap-8">
	<div>
		<h1>Suche</h1>
		<p>
			Durchsuchen Sie hier das komplette Textkorpus des ›Parzival‹. Standardmäßig durchsuchen Sie
			die Fassungsverse, und Ihnen werden nur genaue Treffer gezeigt. Dabei werden einige
			Normalisierungen berücksichtigt, so dass Ligaturen und andere Sonderformen auch gefunden
			werden. Die Suche nach <i>spigel</i> enthält so zum Beispiel auch Treffer mit Schaft-<i>s</i>
			(<i>ſpigel</i>). Für die Textzeugensuche empfiehlt sich eine unscharfe Suche.
		</p>
		<p>
			Klicken Sie auf das jeweilige Ergebnis, um direkt in die Transkription zu gelangen (aus
			technischen Gründen kann das Suchresultat mitunter von der Transkription leicht abweichen).
		</p>
	</div>
	<div>
		<h2 class="h2">Suchoptionen</h2>
		<div class="flex flex-col w-fit gap-2">
			<Segment
				name="Suchvariante"
				onValueChange={(e) => (useExactSearch = e.value === 'true')}
				value={useExactSearch.toString()}
			>
				<Segment.Item value="true">exakte Suche</Segment.Item>
				<Segment.Item value="false">unscharfe Suche</Segment.Item>
			</Segment>
			<Segment
				name="korpus"
				value={corpus}
				onValueChange={(e) => (corpus = e.value)}
				disabled={!hasDocuments}
			>
				<Segment.Item value="fassungen">Fassungen (1.67MB)</Segment.Item>
				<Segment.Item value="textzeugen">Textzeugen (9.96MB)</Segment.Item>
			</Segment>
		</div>
	</div>
</section>
<section class="container mx-auto">
	<form
		class="grid grid-cols-[4fr,1fr] gap-1 max-w-screen-md"
		onsubmit={() => {
			searchResults = handleSearch(searchtext);
			searchResults.then((r) => {
				searchResultArray = r;
			});
		}}
	>
		<div class="flex gap-4">
			<label class="flex-1">
				<input
					class="input p-6 placeholder-primary-600 w-full"
					type="text"
					placeholder="..."
					bind:value={searchtext}
				/>
			</label>

			{#if hasDocuments}
				<button class="btn preset-filled">Suchen</button>
			{:else}
				<button class="btn preset-filled-warning-500" disabled>
					Lade Suche <i class="ml-1 fa-solid fa-spinner fa-spin"></i>
				</button>
			{/if}
		</div>
		{#await searchResults then r}
			<p>{r.length === 1 ? '1 Ergebnis' : `${r.length} Ergebnisse`}</p>
		{/await}
	</form>
</section>
<section class="container mx-auto mt-4">
	{#await searchResults}
		<p>Suche läuft...</p>
	{:then r}
		{#if r.length != 0}
			<Datatable searchResults={r} korpus={corpus} exact={useExactSearch} />
		{:else}
			<p>Keine Ergebnisse</p>
		{/if}
	{/await}
</section>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	:global(mark) {
		@apply bg-inherit;
		@apply font-bold;
		@apply text-inherit;
	}
</style>
