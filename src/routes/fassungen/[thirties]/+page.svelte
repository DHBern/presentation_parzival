<script>
	import { base } from '$app/paths';
	import FassungenContent from './FassungenContent.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	let localPages = $state([]);

	$effect(() => {
		localPages = fetch(`${base}/fassungen/data/${data.thirties}`).then((r) => r.json());
	});
</script>

<section class="w-full">
	<h1 class="h1 my-4">Fassungsansicht</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>Einstellungen und Links zu den Textzeugen.</p>
	</div>
	{#await localPages}
		<p>loading...</p>
	{:then pagearray}
		<div
			class="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 bg-surface-active-token my-4 py-4 px-8 rounded-xl"
		>
			{#each pagearray as pages}
				<FassungenContent {pages} />
			{/each}
		</div>
	{/await}
</section>
