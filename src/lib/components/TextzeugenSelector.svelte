<script>
	import VerseSelector from '$lib/components/VerseSelector.svelte';

	/** @type {{sigla?: {sigil: String, loc: String, aka: String, cod: String, handle: String}[], selectedSigla?: any, coordinates?: [String | boolean, String | boolean]}} */
	let { sigla = [], selectedSigla = ['d'], coordinates = ['', ''] } = $props();
	let selection = $state(selectedSigla);
</script>

<div>
	<div class="flex gap-6 my-3">
		{#each Array.from({ length: 2 }) as _, i}
			<label>
				Textzeuge: <select class="select my-2" bind:value={selection[i]}>
					{#if i !== 0}<option value="">kein Textzeuge</option>{/if}
					{#each sigla as { sigil, handle }}
						<option value={handle}>{@html sigil}</option>
					{/each}
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
