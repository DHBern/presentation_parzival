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
	let additionsSlider = $state(verse.includes('-'));

	let prevVerseURL = $derived(
		data?.metadata?.prev
			? `${base}/einzelverssynopse/${data?.metadata?.prev?.thirties}/${data?.metadata?.prev?.verse}`
			: ''
	);

	let nextVerseURL = $derived(
		data?.metadata?.next
			? `${base}/einzelverssynopse/${data?.metadata?.next?.thirties}/${data?.metadata?.next?.verse}`
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

	function flatSortedWitnesses(hyparchetypes) {
		const all = hyparchetypes.flatMap((a) => a.witnesses ?? []);
		const nonFr = all.filter((w) => !w.toLowerCase().startsWith('fr'));
		const fr = all
			.filter((w) => w.toLowerCase().startsWith('fr'))
			.sort();

		return [...nonFr, ...fr];
	}

</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="container mx-auto p-4 grid lg:grid-cols-[1fr_auto] justify-between gap-9">
	<h1 class="h1 w-full col-span-full">Verssynopse zu {thirties}.{verseNoZero}</h1>
	<section class="lg:order-2">
		<Switch
			name="hyparchetypes-slider"
			thumbInactive="bg-surface-800"
			controlInactive="bg-surface-100"
			checked={hyparchetypesSlider}
			onCheckedChange={(e) => (hyparchetypesSlider = e.checked)}
		>
			Fassungstexte ein-/ausblenden und nach Fassungen sortieren.
		</Switch>
		{#if metadata?.hasAdditions}
			<br />
			<Switch
				name="additions-slider"
				thumbInactive="bg-surface-800"
				controlInactive="bg-surface-100"
				checked={additionsSlider}
				onCheckedChange={(e) => (additionsSlider = e.checked)}
			>
				Für diesen Vers sind Zusatzverse vorhanden: ein-/ausblenden.
			</Switch>
		{/if}
		<h2 class="h2 my-7">Zu Vers springen:</h2>
		<VerseSelector targetPath="/einzelverssynopse" coordinates={[thirties, verse]} />
		<div class="flex justify-between">
			{#if data?.metadata?.prev}
				<a class="anchor" href={prevVerseURL}> vorheriger Vers </a>
			{/if}
			{#if data?.metadata?.next}
				<a class="anchor" href={nextVerseURL}> nächster Vers </a>
			{/if}
		</div>
	</section>
	<div class="tei-content lg:order-1">
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
					{#if hyparchetypesSlider}
						{#each metadata.hyparchetypes as archetype (archetype.handle)}
						<tr>
							<td class="pr-4 py-1 font-sans">{thirties}.{verseNoZero}</td>
							<td class="pr-4 py-1 font-sans"
								><a class="anchor" href="{base}/fassungen/{thirties}">{archetype?.sigil}</a></td
							>
							{#await publisherData[archetype.handle]}
								<td class="border-l-2 border-current pl-4 py-1 font-sans"></td>
							{:then value}
								{#if value && value[0]?.content}
									<td class="border-l-2 border-current pl-4 py-1 font-sans"
										>{@html value[0]?.content}</td
									>
								{:else}
									<td class="border-l-2 border-current pl-4 py-1 font-sans"></td>
								{/if}
							{/await}
						</tr>
							{#each (archetype.witnesses) as witness}
								{#each publisherData[witness] as witnessData}
									{#if witnessData?.content}
										{@const verseWithAdd = witnessData?.id.split('.').pop()}
										{#if additionsSlider || !verseWithAdd.match(/-\d/g)}
											<tr>
												<td class="pr-4 pt-2 pl-5">
													{thirties}.{verseWithAdd.replace(/^0+/, '')}
												</td>
												<td class="pr-4 pt-2 pl-5">
													<a class="anchor" href="{base}/textzeugen/{witness}/{thirties}/{verseWithAdd}">
														{[...metadata.codices, ...metadata.fragments].find((c) => c.handle === witness)?.sigil}
													</a>
												</td>
												<td class="border-l-2 border-current pl-5 pl-4 py-1">
													{@html witnessData?.content}
												</td>
											</tr>
										{/if}
									{/if}
								{/each}
							{/each}
						{/each}
					{:else}
						{#each flatSortedWitnesses(metadata.hyparchetypes) as witness}
							{#each publisherData[witness] as witnessData}
								{#if witnessData?.content}
									{@const verseWithAdd = witnessData?.id.split('.').pop()}
									{#if additionsSlider || !verseWithAdd.match(/-\d/g)}
										<tr>
											<td class="pr-4 pt-2">
												{thirties}.{verseWithAdd.replace(/^0+/, '')}
											</td>
											<td class="pr-4 pt-2">
												<a class="anchor" href="{base}/textzeugen/{witness}/{thirties}/{verseWithAdd}">
													{[...metadata.codices, ...metadata.fragments].find((c) => c.handle === witness)?.sigil}
												</a>
											</td>
											<td class="border-l-2 border-current pl-4 py-1">
												{@html witnessData?.content}
											</td>
										</tr>
									{/if}
								{/if}
							{/each}
						{/each}
					{/if}
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
</div>

<style global>
	.anchor {
		color: var(--color-primary-500);
		text-decoration: none;
	}
</style>
