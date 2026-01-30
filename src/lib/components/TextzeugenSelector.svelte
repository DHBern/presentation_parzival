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

<div>
	<div class="flex gap-6 my-3">
		{#each Array.from({ length: 2 }) as _, i}
			<label>
				{#if i === 0}Textzeuge{:else}Textzeugenvergleich{/if}:
				<select class="select my-2" bind:value={selection[i]}>
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
	</div>
	<div class="flex max-w-full items-baseline gap-1 my-3">
		<VerseSelector
			targetPath={`/textzeugen/${selection.filter((e) => !!e).join('-')}`}
			{coordinates}
		/>
	</div>
</div>
