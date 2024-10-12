<script>
	import { SlideToggle } from '@skeletonlabs/skeleton';
	import VerseSelector from '$lib/components/VerseSelector.svelte';
	import { base } from '$app/paths';

	/** @type {import('./$types').PageData} */
	export let data;

	$: ({ thirties, verse, sigla, publisherData, loss } = data);
	let hyparchetypesSlider = false;
</script>

<div class="container mx-auto p-4 flex flex-wrap justify-between gap-9">
	<h1 class="h1 w-full">Verssynopse zu {thirties}.{verse}</h1>
	<div>
		<dl class="grid grid-cols-[auto_1fr] justify-between h-fit mb-4 w-fit font-mono">
			<dt class="font-bold font-heading-token pr-4">Handschrift</dt>
			<dd class="font-bold font-heading-token border-l-2 border-current pl-4">Wortlaut</dd>
			{#each sigla.hyparchetypes as archetype (archetype.handle)}
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
					{#await publisherData[witness] then value}
						{#if value?.content}
							<dt class="pr-4 pt-2 {hyparchetypesSlider ? 'ml-5' : ''}">
								{sigla.codices.find((c) => c.handle === witness)?.sigil}
							</dt>
							<dd class="border-l-2 border-current {hyparchetypesSlider ? 'ml-5' : ''} pl-4 py-1">
								{@html value.content}
							</dd>
						{/if}
					{:catch error}
						<p>error: {error.message}</p>
					{/await}
				{/each}
			{/each}
		</dl>
		{#if loss.length > 0}
			<p class="max-w-sm">
				Der Vers {thirties}.{verse} fehlt in folgenden Handschriften aufgrund eines umfangreichen Textausfalls
				(Fragmente werden für diese Auflistung nicht berücksichtigt):
				<b>{loss.join(', ')}</b>
			</p>
		{/if}
	</div>
	<section>
		<SlideToggle
			name="hyparchetypes-slider"
			active="bg-primary-500"
			bind:checked={hyparchetypesSlider}
		>
			Fassungsverse ein-/ausblenden und nach diesen sortieren
		</SlideToggle>
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
			{#if !(parseInt(thirties) === 827 && parseInt(verse) >= 30)}
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
