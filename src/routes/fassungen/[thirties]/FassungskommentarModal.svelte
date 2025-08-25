<script>
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { commentary, id, openState = $bindable() } = $props();
</script>

<Modal
	defaultOpen={true}
	onOpenChange={() => (openState = false)}
	classes="fassungskommentar_modal"
	triggerBase="btn preset-tonal"
	contentBase="w-[80vw] card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-lg"
	base=""
	backdropClasses="backdrop-blur-sm"
>
	{#snippet content()}
		{#if id[2] !== 'A'}
			<header class="flex justify-between bg-green-400">
				<h1 class="h5">Editorischer Kommentar</h1>
			</header>
		{/if}
		<article class="fk-modal-content max-h-[80vh] overflow-auto">
			{#if content}
				{@html commentary}
			{/if}
		</article>
	{/snippet}
</Modal>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.fk-modal-content {
		:global(.fassungs-kommentar a) {
			@apply text-primary-800 font-bold;
		}
		:global(.fk-title) {
			@apply h3;
		}
		:global(.fk-content) {
			@apply my-3;
		}
		:global(.fk-commentary) {
			@apply mb-1 text-lg;
		}
		:global(.fk-literatur) {
			@apply first:mt-8; /* this does not work... why? */
		}
		:global(.fk-literatur .fk-commentary) {
			@apply my-3  text-sm;
		}
		:global(.fk-bold) {
			@apply font-bold;
		}
		:global(.fk-italic) {
			@apply italic;
		}
		:global(.fk-small-caps) {
			@apply [font-variant:small-caps];
		}
	}
</style>
