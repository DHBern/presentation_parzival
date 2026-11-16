<script module>
	import { citations, findPageCitation, getCitationSlug } from '$lib/data/citations';

	const citationData = await citations;
</script>

<script>
	import { page } from '$app/state';
	import { base } from '$app/paths';

	const doi = $derived.by(() => {
		if (page.error || page.status >= 400) {
			return undefined;
		}

		if (getCitationSlug(page.url, base) === 'transkriptionen') {
			return page.data.content?.[0]?.citationDoi ?? undefined;
		}

		return findPageCitation(citationData.citations, page.url, base)?.citation_doi;
	});
</script>

<svelte:head>
	{#if doi}
		<meta name="DC.identifier" content={doi} />
	{/if}
</svelte:head>
