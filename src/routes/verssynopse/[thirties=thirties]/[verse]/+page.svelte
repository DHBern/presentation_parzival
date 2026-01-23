<script>
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import VerseSelector from '$lib/components/VerseSelector.svelte';
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();

	let { thirties, verse, metadata, publisherData, loss } = $derived(data);
	// remove leading zeros in verse
	let verseNoZero = $derived(verse.replace(/^0+/, ''));
	let hyparchetypesSlider = $state(false);

	let prevVerseURL = $derived(
		data?.metadata?.prev
			? `${base}/verssynopse/${data?.metadata?.prev?.thirties}/${data?.metadata?.prev?.verse}`
			: ''
	);

	let nextVerseURL = $derived(
		data?.metadata?.next
			? `${base}/verssynopse/${data?.metadata?.next?.thirties}/${data?.metadata?.next?.verse}`
			: ''
	);

	/**
	 * @param { KeyboardEvent } ev
	 */
	function handleKeyDown(ev) {
		// Ignore if modifier keys are pressed
		if (ev.altKey || ev.ctrlKey || ev.metaKey || ev.shiftKey) {
			return;
		}
		if (ev.key === 'ArrowRight') {
			goto(nextVerseURL);
		}
		if (ev.key === 'ArrowLeft') {
			goto(prevVerseURL);
		}
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="container mx-auto p-4 flex flex-wrap justify-between gap-9">
	<h1 class="h1 w-full">Verssynopse zu {thirties}.{verseNoZero}</h1>
	<div class="tei-content">
		<table class="table-auto h-fit mb-4 w-fit">
			<thead>
				<tr>
					<th class="font-bold font-heading-token pr-4 text-left">Versziffer</th>
					<th class="font-bold font-heading-token pr-4 text-left">Handschrift</th>
					<th class="font-bold font-heading-token border-l-2 border-current pl-4 text-left"
						>Wortlaut</th
					>
				</tr>
			</thead>
			<tbody>
				{#each metadata.hyparchetypes as archetype (archetype.handle)}
					{#if hyparchetypesSlider}
						<tr>
							<td class="pr-4 py-1 font-sans">{thirties}.{verseNoZero}</td>
							<td class="pr-4 py-1 font-sans"
								><a class="anchor" href="{base}/fassungen/{thirties}">{archetype.sigil}</a></td
							>
							{#await publisherData[archetype.handle]}
								<td class="border-l-2 border-current pl-4 py-1 font-sans"></td>
							{:then value}
								{#if value[0]?.content}
									<td class="border-l-2 border-current pl-4 py-1 font-sans"
										>{@html value[0]?.content}</td
									>
								{:else}
									<td class="border-l-2 border-current pl-4 py-1 font-sans"></td>
								{/if}
							{/await}
						</tr>
					{/if}
					{#each archetype.witnesses as witness}
						{#each publisherData[witness] as witnessData}
							{#if witnessData?.content}
								{@const verseWithAdd = witnessData?.id.split('.').pop().replace(/^0+/, '')}
								<tr>
									<td class={`pr-4 pt-2 ${hyparchetypesSlider ? 'pl-5' : ''}`}>
										{thirties}.{verseWithAdd}
									</td>
									<td class={`pr-4 pt-2 ${hyparchetypesSlider ? 'pl-5' : ''}`}>
										<a class="anchor" href="{base}/transkriptionen/{witness}/{thirties}/{verseWithAdd}"
											>{metadata.codices.find(
												(/** @type {{ handle: any }} */ c) => c.handle === witness
											)?.sigil}</a
										>
									</td>
									<td
										class={`border-l-2 border-current ${hyparchetypesSlider ? 'pl-5' : ''} pl-4 py-1`}
									>
										{@html witnessData?.content}
									</td>
								</tr>
							{/if}
						{/each}
					{/each}
				{/each}
			</tbody>
		</table>
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
		<VerseSelector targetPath="/verssynopse" coordinates={[thirties, verse]} />
		<div class="flex justify-between">
			{#if data?.metadata?.prev}
				<a class="anchor" href={prevVerseURL}> vorheriger Vers </a>
			{/if}
			{#if data?.metadata?.next}
				<a class="anchor" href={nextVerseURL}> nächster Vers </a>
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
