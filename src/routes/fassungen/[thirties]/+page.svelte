<script>
	import { base } from '$app/paths';
	import { SvelteMap } from 'svelte/reactivity';
	import FassungenContent from './FassungenContent.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	let localPages = $state([new SvelteMap(), new SvelteMap(), new SvelteMap(), new SvelteMap()]);

	const checkAndFetch = async (/** @type {string} */ page) => {
		if (!localPages[0].has(page)) {
			let [d, m, G, T] = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
			localPages[0].set(page, d);
			localPages[1].set(page, m);
			localPages[2].set(page, G);
			localPages[3].set(page, T);
		}
	};

	$effect(async () => {
		// need to await the fetches because of race condition: random order of thirties
		await checkAndFetch(String(Number(data.thirties) - 1));
		await checkAndFetch(data.thirties);
		await checkAndFetch(String(Number(data.thirties) + 1));
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
		{#each localPages as pages}
			{#if pages.size >= 3}
				<!-- when at least 3 pages are loaded, the one for the currect thirties should be loaded aswell  -->
				<FassungenContent {pages} />
			{/if}
		{/each}
	</div>
</section>
