<script>
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import FassungenContent from './FassungenContent.svelte';
	import { SlideToggle } from '@skeletonlabs/skeleton';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
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
			// if the page is not already loaded
			if (!this.thirties.length) {
				let d, m, G, T;
				// fetch the page before the current one if the current one is not the first
				if (page - 1 > 0) {
					[d, m, G, T] = await fetch(`${base}/fassungen/data/${page - 1}`).then((r) => r.json());
					this.pages[0].push([page - 1, d]);
					this.pages[1].push([page - 1, m]);
					this.pages[2].push([page - 1, G]);
					this.pages[3].push([page - 1, T]);
					this.thirties.push(page - 1);
				}
				// fetch the current page
				if (page <= NUMBER_OF_PAGES) {
					[d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					this.pages[0].push([page, d]);
					this.pages[1].push([page, m]);
					this.pages[2].push([page, G]);
					this.pages[3].push([page, T]);
					this.thirties.push(page);
				}
				// fetch the page after the current one if the current one is not the last
				if (page !== NUMBER_OF_PAGES) {
					[d, m, G, T] = await fetch(`${base}/fassungen/data/${page + 1}`).then((r) => r.json());
					this.pages[0].push([page + 1, d]);
					this.pages[1].push([page + 1, m]);
					this.pages[2].push([page + 1, G]);
					this.pages[3].push([page + 1, T]);
					this.thirties.push(page + 1);
				}
				if (page > NUMBER_OF_PAGES) {
					console.error('Page out of bounds');
				}
			} else {
				if (page < Number(this.thirties[0])) {
					let [d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					this.pages[0].unshift([page, d]);
					this.pages[1].unshift([page, m]);
					this.pages[2].unshift([page, G]);
					this.pages[3].unshift([page, T]);
					this.thirties.unshift(page);
				} else if (page > Number(this.thirties[this.thirties.length - 1])) {
					let [d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					this.pages[0].push([page, d]);
					this.pages[1].push([page, m]);
					this.pages[2].push([page, G]);
					this.pages[3].push([page, T]);
					this.thirties.push(page);
				} else if (page === Number(this.thirties[0]) && page > 1) {
					this.fetchPage(page - 1);
				} else if (
					page === Number(this.thirties[this.thirties.length - 1]) &&
					page !== NUMBER_OF_PAGES
				) {
					this.fetchPage(page + 1);
				}
			}
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
		<SlideToggle active="bg-primary-500" name="synchro" bind:checked={synchro}>
			Synchrones scrollen
		</SlideToggle>
	</div>
	<div class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 my-4 pl-4">
		{#each localPages.pages as pages, i}
			{#if pages.length >= 2}
				<!-- when at least 2 pages are loaded, the one for the currect thirties should be loaded aswell  -->
				{#if synchro}
					<FassungenContent {pages} bind:scrolltop synchro={i === 0} />
				{:else}
					<FassungenContent {pages} synchro={true} />
				{/if}
			{/if}
		{/each}
	</div>
</section>
