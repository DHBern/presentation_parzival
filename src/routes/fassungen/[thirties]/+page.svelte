<script>
	import FassungenSyncContent from './FassungenSyncContent.svelte';
	import FassungenContent from './FassungenContent.svelte';
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let verseWidth = $derived(page.data.thirties.length + 4);

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
			const prepareHTML = (/** @type {string} */ html, /** @type {string} */ column) => {
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
				if (page > 1) {
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
	let synchro = $state(true);
	let windowWidth = $state(0);
	/**@type {boolean|CSSStyleDeclaration} **/ let styles = $state(false);
	let mobileBreakpoint = $derived.by(() => {
		if (typeof styles === 'object') {
			return (
				windowWidth / (16 * Number(styles.getPropertyValue('--text-scaling'))) >=
				parseInt(styles.getPropertyValue('--breakpoint-md'))
			);
		}
		return false;
	});
	onMount(() => {
		styles = getComputedStyle(document.documentElement);
	});
	$effect(() => {
		if (!mobileBreakpoint) {
			synchro = false;
		}
	});
</script>

<svelte:window bind:innerWidth={windowWidth} />
<section class="w-full" style="--verse-width: {verseWidth}ch">
	{#snippet nextPrevButton(next, page, column)}
		<button
			class="btn preset-filled-primary-500 w-full mb-4 {column ? 'column-' + column : ''}"
			onclick={() =>
				goto(`${base}/fassungen/${page}`, {
					noScroll: true,
					keepFocus: true,
					replaceState: true
				})}
		>
			{next ? 'Lade nächsten Dreißiger' : 'Lade vorherigen Dreißiger'}
		</button>
	{/snippet}
	<h1 class="h1 my-4">Fassungsansicht</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>Einstellungen und Links zu den Textzeugen.</p>

		{#if mobileBreakpoint}
			<Switch
				controlActive="bg-primary-500"
				name="synchro"
				checked={synchro}
				onCheckedChange={(e) => (synchro = e.checked)}>Synchrones scrollen</Switch
			>
		{/if}
	</div>
	{#if synchro}
		<FassungenSyncContent content={localPages.pages} titles={composureTitles} {nextPrevButton} />
	{:else}
		<div class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 my-4">
			{#each localPages.pages as fassung, i}
				<div>
					<h2 class="h2">{composureTitles[i]}</h2>
					{#if fassung.length >= 2}
						<!-- when at least 2 pages are loaded, the one for the currect thirties should be loaded aswell  -->
						<FassungenContent pages={fassung} {nextPrevButton} />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
