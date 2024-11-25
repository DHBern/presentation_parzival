<script>
	import { base } from '$app/paths';
	import FassungenContent from './FassungenContent.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	class localPageClass {
		/**
		 * @type {[[number, string][],[number, string][],[number, string][],[number, string][]]}
		 */
		pages = $state([[], [], [], []]);
		/**
		 * @type {string[]}
		 */
		thirties = [];

		fetchPage = async (/** @type {string} */ page) => {
			// console.log('fetching', page);
			// console.log(Number(page), !this.thirties.length);
			if (!this.thirties.length) {
				let [d, m, G, T] = await fetch(`${base}/fassungen/data/${Number(page) - 1}`).then((r) =>
					r.json()
				);
				this.pages[0].push([Number(page) - 1, d]);
				this.pages[1].push([Number(page) - 1, m]);
				this.pages[2].push([Number(page) - 1, G]);
				this.pages[3].push([Number(page) - 1, T]);
				this.thirties.push(String(Number(page) - 1));
				[d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
				this.pages[0].push([Number(page), d]);
				this.pages[1].push([Number(page), m]);
				this.pages[2].push([Number(page), G]);
				this.pages[3].push([Number(page), T]);
				this.thirties.push(page);
				[d, m, G, T] = await fetch(`${base}/fassungen/data/${Number(page) + 1}`).then((r) =>
					r.json()
				);
				this.pages[0].push([Number(page) + 1, d]);
				this.pages[1].push([Number(page) + 1, m]);
				this.pages[2].push([Number(page) + 1, G]);
				this.pages[3].push([Number(page) + 1, T]);
				this.thirties.push(String(Number(page) + 1));
			} else {
				if (Number(page) < Number(this.thirties[0])) {
					// console.log('fetching before');
					let [d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					this.pages[0].unshift([Number(page), d]);
					this.pages[1].unshift([Number(page), m]);
					this.pages[2].unshift([Number(page), G]);
					this.pages[3].unshift([Number(page), T]);
					this.thirties.unshift(page);
				} else if (Number(page) > Number(this.thirties[this.thirties.length - 1])) {
					let [d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					this.pages[0].push([Number(page), d]);
					this.pages[1].push([Number(page), m]);
					this.pages[2].push([Number(page), G]);
					this.pages[3].push([Number(page), T]);
					this.thirties.push(page);
				} else if (Number(page) === Number(this.thirties[0])) {
					this.fetchPage(String(Number(page) - 1));
				} else if (Number(page) === Number(this.thirties[this.thirties.length - 1])) {
					this.fetchPage(String(Number(page) + 1));
				}
			}
		};
	}

	let localPages = new localPageClass();

	$effect(() => {
		localPages.fetchPage(data.thirties);
	});
</script>

<section class="w-full">
	<h1 class="h1 my-4">Fassungsansicht</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>Einstellungen und Links zu den Textzeugen.</p>
	</div>
	<div
		class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 bg-surface-active-token my-4 py-4 px-8 rounded-xl"
	>
		{#each localPages.pages as pages}
			{#if pages.length >= 3}
				<!-- when at least 3 pages are loaded, the one for the currect thirties should be loaded aswell  -->
				<FassungenContent {pages} />
			{/if}
		{/each}
	</div>
</section>
