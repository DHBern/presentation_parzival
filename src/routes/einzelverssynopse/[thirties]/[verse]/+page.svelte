<script>
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import VerseSelector from '$lib/components/VerseSelector.svelte';
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	let { thirties, verse, metadata, publisherData, loss } = $derived(data);
	// remove leading zeros in verse
	let verseNoZero = $derived(verse.replace(/^0+/, ''));
	let hyparchetypesSlider = $state(false);
</script>

<div class="container mx-auto p-4 flex flex-wrap justify-between gap-9">
	<h1 class="h1 w-full">Verssynopse zu {thirties}.{verseNoZero}</h1>
	<div class="tei-content">
		<dl class="grid grid-cols-[auto_1fr] justify-between h-fit mb-4 w-fit font-mono">
			<dt class="font-bold font-heading-token pr-4">Handschrift</dt>
			<dd class="font-bold font-heading-token border-l-2 border-current pl-4">Wortlaut</dd>
			{#each metadata.hyparchetypes as archetype (archetype.handle)}
				{#if hyparchetypesSlider}
					<dt class="pr-4 py-1 font-sans">{archetype.sigil}</dt>
					{#await publisherData[archetype.handle]}
						<dd class="border-l-2 border-current pl-4 py-1 font-sans"></dd>
					{:then value}
						{#if value?.content}
							<dd class="border-l-2 border-current pl-4 py-1 font-sans">{@html value?.content}</dd>
						{:else}
							<dd class="border-l-2 border-current pl-4 py-1"></dd>
						{/if}
					{/await}
				{/if}
				{#each archetype.witnesses as witness}
					{#if publisherData[witness]?.content}
						<dt class="pr-4 pt-2 {hyparchetypesSlider ? 'ml-5' : ''}">
							{metadata.codices.find((c) => c.handle === witness)?.sigil}
						</dt>
						<dd class="border-l-2 border-current {hyparchetypesSlider ? 'ml-5' : ''} pl-4 py-1">
							{@html publisherData[witness]?.content}
						</dd>
					{/if}
				{/each}
			{/each}
		</dl>
		{#if loss.length > 0}
			<p class="max-w-sm">
				Der Vers {thirties}.{verseNoZero} fehlt in folgenden Handschriften aufgrund eines umfangreichen
				Textausfalls (Fragmente werden für diese Auflistung nicht berücksichtigt):
				<b>{loss.join(', ')}</b>
			</p>
		{/if}
	</div>
	<section>
		<Switch
			name="hyparchetypes-slider"
			thumbInactive="bg-surface-800"
			controlInactive="bg-surface-100"
			checked={hyparchetypesSlider}
			onCheckedChange={(e) => (hyparchetypesSlider = e.checked)}
		>
			Fassungstexte ein-/ausblenden und nach Fassungen sortieren
		</Switch>
		<h2 class="h2 my-7">Zu Vers springen:</h2>
		<VerseSelector targetPath="/einzelverssynopse" />
		<div class="flex justify-between">
			{#if !(parseInt(thirties) === 1 && parseInt(verse) === 1)}
				<a
					class="anchor"
					href="{base}/einzelverssynopse/{parseInt(verse) === 1
						? parseInt(thirties) - 1
						: thirties}/{parseInt(verse) === 1 ? 30 : parseInt(verse) - 1}"
				>
					vorheriger Vers
				</a>
			{/if}
			{#if !(parseInt(thirties) === NUMBER_OF_PAGES && parseInt(verse) >= 30)}
				<a
					class="anchor"
					href="{base}/einzelverssynopse/{parseInt(verse) >= 30
						? parseInt(thirties) + 1
						: thirties}/{parseInt(verse) >= 30 ? 1 : parseInt(verse) + 1}"
				>
					nächster Vers
				</a>
			{/if}
		</div>
	</section>
</div>

<style global>
	.anchor {
		color: var(--color-primary-500);
		text-decoration: none;
	}
</style>
