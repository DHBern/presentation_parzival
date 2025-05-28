<script>
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import FassungenContent from './FassungenContent.svelte';
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	const composureTitles = ['*D', '*m', '*G', '*T'];
	class localPageClass {
		/**
		 * for the Fassungen *d, *m, *G and *T
		 * @type {[[number, string][],[number, string][],[number, string][],[number, string][]]}
		 */
		pages = $state([[], [], [], []]);
		/**
		 * @type {Number[]}
		 */
		thirties = [];

		/**
		 * Fetches data for the specified page number.
		 * @param {Number} page - The page number to fetch data for.
		 * @returns {Promise<void>} - A promise that resolves when the data is fetched.
		 */
		fetchPage = async (/** @type {Number} */ page) => {
			let prepareHTML = (/** @type {string} */ html, /** @type {string} */ column) => {
				// select all lines in the HTML and process them
				const parser = new DOMParser();
				const doc = parser.parseFromString(html, 'text/html');
				const lines = doc.querySelectorAll('div.line');
				lines.forEach((line) => {
					line.classList.add(`column-${column}`);
				});
				return Array.from(lines)
					.map((line) => line.outerHTML)
					.join('');
			};
			let labels = ['d', 'm', 'G', 'T'];
			// if the page is not already loaded
			if (!this.thirties.length) {
				let content;
				// fetch the page before the current one if the current one is not the first
				if (page - 1 > 0) {
					content = await fetch(`${base}/fassungen/data/${page - 1}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page - 1, preparedHTML]);
					});
					this.thirties.push(page - 1);
				}
				// fetch the current page
				if (page <= NUMBER_OF_PAGES) {
					content = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page, preparedHTML]);
					});
					this.thirties.push(page);
				}
				// fetch the page after the current one if the current one is not the last
				if (page !== NUMBER_OF_PAGES) {
					content = await fetch(`${base}/fassungen/data/${page + 1}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page + 1, preparedHTML]);
					});
					this.thirties.push(page + 1);
				}
				if (page > NUMBER_OF_PAGES) {
					console.error('Page out of bounds');
				}
			} else {
				if (page < this.thirties[0] && !this.thirties.includes(page)) {
					let content = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].unshift([page, preparedHTML]);
					});
					this.thirties.unshift(page);
				} else if (page > this.thirties[this.thirties.length - 1]) {
					let content = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page, preparedHTML]);
					});
					this.thirties.push(page);
				} else if (page === this.thirties[0] && page > 1) {
					this.fetchPage(page - 1);
				} else if (page === this.thirties[this.thirties.length - 1] && page !== NUMBER_OF_PAGES) {
					this.fetchPage(page + 1);
				}
			}
			return Promise.resolve();
		};
	}

	let localPages = new localPageClass();
	$effect(() => {
		localPages.fetchPage(Number(data.thirties));
	});
	let scrolltop = $state(0);
	let synchro = $state(true);
</script>

<section class="w-full">
	<h1 class="h1 my-4">Fassungsansicht</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>Einstellungen und Links zu den Textzeugen.</p>
		<Switch
			controlActive="bg-primary-500"
			name="synchro"
			checked={synchro}
			onCheckedChange={(e) => (synchro = e.checked)}>Synchrones scrollen</Switch
		>
	</div>
	{#if synchro}
		<div class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 my-4">
			{#each localPages.pages as fassung, i}
				<h2 class="h2">{composureTitles[i]}</h2>
			{/each}
		</div>
		<div
			class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-x-4 my-4 tei-content grid-flow-dense max-h-[70vh] overflow-y-auto"
		>
			{#each localPages.pages as fassung, i}
				{#if fassung.length >= 2}
					<!-- when at least 2 pages are loaded, the one for the currect thirties should be loaded aswell  -->
					{#each fassung as page, j (page[0])}
						{@const column = ['d', 'm', 'G', 'T'][i]}
						{@html page[1]}
						<hr class="!border-t-4 !border-primary-500 column-{column}" />
					{/each}
				{/if}
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 my-4">
			{#each localPages.pages as fassung, i}
				<div>
					<h2 class="h2">{composureTitles[i]}</h2>
					{#if fassung.length >= 2}
						<!-- when at least 2 pages are loaded, the one for the currect thirties should be loaded aswell  -->
						<FassungenContent pages={fassung} observe={true} />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	@reference "@skeletonlabs/skeleton/optional/presets";
	:global(.line) {
		@apply grid grid-cols-[4ch] grid-flow-col items-center-safe;
		@apply preset-filled-surface-500;
		:global(.verse) {
			@apply ml-1;
		}
	}
	:global(.line:first-child) {
		@apply rounded-t-xl;
	}
	@variant md {
		:global(.column-d) {
			grid-column: 1;
		}
		:global(.column-m) {
			grid-column: 2;
		}
		:global(.column-G) {
			grid-column: 3;
		}
		:global(.column-T) {
			grid-column: 4;
		}
		.tei-content {
			:global(:nth-child(1 of .column-T)),
			:global(:nth-child(1 of .column-G)),
			:global(:nth-child(1 of .column-m)),
			:global(:nth-child(1 of .column-d)) {
				@apply rounded-t-xl;
			}
			:global(:nth-last-child(1 of .column-T)),
			:global(:nth-last-child(1 of .column-G)),
			:global(:nth-last-child(1 of .column-m)),
			:global(:nth-last-child(1 of .column-d)) {
				@apply rounded-b-xl;
			}
		}
	}
</style>
