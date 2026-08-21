<script>
	import VerseSelector from '$lib/components/VerseSelector.svelte';

	/** @type {{sigla?: {sigil: String, loc: String, aka: String, cod: String, handle: String}[] | Promise<{sigil: String, loc: String, aka: String, cod: String, handle: String}[]>, selectedSigla?: any, coordinates?: [String | boolean, String | boolean]}} */
	let {
		sigla = import('$lib/data/metadata').then((m) =>
			m.metadata.then((data) => [...data.codices, ...data.fragments])
		),
		selectedSigla = ['d'],
		coordinates = ['', '']
	} = $props();
	let selection = $state(selectedSigla);
</script>

<div class="flex flex-wrap items-baseline gap-x-10">
	{#each Array.from({ length: 2 }) as _, i}
		<label class="flex items-baseline gap-2 shrink-0 font-bold">
			{#if i === 0}Textzeuge{:else}Textzeugenvergleich{/if}:
			<select class="select font-normal" bind:value={selection[i]}>
				{#if i !== 0}
					<option value=""> --- </option>
				{/if}
				{#await sigla then resolvedSigla}
					{#each resolvedSigla as { sigil, handle }}
						<option value={handle}>{@html sigil}</option>
					{/each}
				{/await}
			</select>
		</label>
	{/each}
	<VerseSelector
		targetPath={`/transkriptionen/${selection.filter((/** @type {string} */ e) => !!e).join('-')}`}
		{coordinates}
	/>
</div>
