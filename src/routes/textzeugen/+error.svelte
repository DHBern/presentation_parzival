<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';

	let message = $derived(page.error?.message.split('/') || []);
</script>

<h2 class="h2 pb-6">Ungültige Adresse</h2>
<p class="mb-6">
	{#if message.length === 1}
		Es gibt keinen Textzeugen {message[0]}. Suchen Sie bitte einen gültigen Textzeugen aus der Liste
		aus.
	{:else}
		Entweder ist {message[0]} kein gültiger Textzeuge oder {message[1]} ist kein gültiger Dreißiger. Springen
		Sie unten an eine gültige Stelle.
	{/if}
</p>
<a class="anchor" href="{base}/#edition-nach-dreissigern">Zur Dreißiger-Matrix</a>
<TextzeugenSelector />
