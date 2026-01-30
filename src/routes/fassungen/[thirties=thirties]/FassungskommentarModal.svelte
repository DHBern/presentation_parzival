<script>
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { commentary, id, openState = $bindable() } = $props();
</script>

<Modal
	defaultOpen={true}
	onOpenChange={() => (openState = false)}
	classes="fassungskommentar_modal"
	triggerBase="btn preset-tonal"
	contentBase="w-[80vw] card preset-filled border border-gray-400 rounded-md text-black space-y-4 shadow-xl max-w-screen-lg"
	base=""
	backdropClasses="bg-black/[0.03]"
>
	{#snippet content()}
		<header class="flex items-center justify-center px-4 py-4 bg-gray-400 rounded-t-md">
			<h1
				class={`text-md uppercase tracking-wider ${
					id[2] === 'A' ? 'text-red-800' :'text-green-900'
				}`}
			>
				Editorischer Kommentar ({id[2] === 'A' ? 'Fassungsübergreifend':'Fassungsintern' })
			</h1>
		</header>
		<article class="p-4 fk-modal-content max-h-[80vh] overflow-auto">
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
		scrollbar-width: thin;
		scrollbar-color: rgba(0, 0, 0, 0.3) transparent;
		:global(.fassungs-kommentar a) {
			@apply anchor font-bold;
		}
		:global(.fk-title) {
			@apply h3 text-black;
		}
		:global(.fk-content) {
			@apply my-3;
		}
		:global(.fk-commentary) {
			@apply mb-1 text-sm;
		}
		:global(.fk-content + .fk-literatur) {
			@apply mt-8;
		}
		:global(.fk-literatur .fk-commentary) {
			@apply my-3  text-xs;
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

	/* WebKit */
	.fk-modal-content::-webkit-scrollbar {
		width: 8px;
	}

	.fk-modal-content::-webkit-scrollbar-track {
		background: transparent;
	}

	.fk-modal-content::-webkit-scrollbar-thumb {
		background-color: rgba(0, 0, 0, 0.25);
		border-radius: 9999px;
	}

	.fk-modal-content::-webkit-scrollbar-thumb:hover {
		background-color: rgba(0, 0, 0, 0.4);
	}
</style>
