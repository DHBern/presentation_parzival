<script>
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	let { dreissiger, verse, comment } = $props();

	function populateAnchorTags(string) {
		return string.replace(/<a>(.*?)<\/a>/g, (match, p1) => {
			return `<a href="/textzeugen/${p1.toLowerCase()}/${dreissiger}/${verse}">${p1}</a>`;
		});
	}

	let openState = $state(false);

	function modalClose() {
		openState = false;
	}
</script>

<!-- max-w-[1500px] border-4 border-surface-500 bg-primary-400 transition-transform duration-500 -->
<Modal
	open={openState}
	onOpenChange={(e) => (openState = e.open)}
	classes="fassungskommentar_modal"
	triggerBase="btn preset-tonal"
	contentBase="card bg-surface-100-900 p-4 space-y-4 shadow-xl max-w-screen-sm"
	backdropClasses="backdrop-blur-sm"
>
	{#snippet trigger()}Open Modal{/snippet}
	{#snippet content()}
		<!-- <div class="py-2 px-4 flex gap-4 justify-between items-center bg-primary-500"> -->
		<header class="flex justify-between">
			<h2 class="h2">Fassungskommentar für {dreissiger}.{verse}</h2>
			<button
				class="close_button cursor-pointer"
				onclick={modalClose}
				aria-label="Apparat schliessen"
				tabindex="0"><i class="fa-solid fa-xmark"></i></button
			>
		</header>
		<article>
			{#if content}
				{@html populateAnchorTags(comment)}
			{/if}
		</article>
	{/snippet}
</Modal>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.fassungen_popover :global(a) {
		@apply text-primary-800 font-bold;
	}
</style>
