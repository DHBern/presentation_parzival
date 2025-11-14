<script>
	import { onMount } from 'svelte';
	import { autoUpdate } from '@floating-ui/dom';
	import { computePosition, offset, flip, shift } from '@floating-ui/dom';
	import { autoPlacement } from '@floating-ui/dom';

	let {
		resetPopup,
		elTrigger,
		dreissiger,
		verse,
		title,
		structure_info,
		reading_info,
		onMouseEnter = () => {},
		onMouseLeave = () => {}
	} = $props();
	let elPopover = $state();

	function updateFunctionFloatingPopover(elMark, elPopup) {
		return () => {
			computePosition(elMark, elPopup, {
				middleware: [
					autoPlacement({ allowedPlacements: ['top', 'bottom'] }),
					offset(1),
					flip(),
					shift()
				],
				strategy: 'absolute'
			}).then(({ x, y }) => {
				elPopup.style.top = `${y}px`;
				elPopup.style.left = `${x}px`;
				elPopup.style.display = 'block';
			});
		};
	}
	const focus = (el) => {
		el.focus();
	};

	const closeOnEscape = (ev) => {
		if (ev.code == 'Escape') resetPopup();
	};

	onMount(() => {
		// Cleanup
		const cleanup = autoUpdate(
			elTrigger,
			elPopover,
			updateFunctionFloatingPopover(elTrigger, elPopover)
		);
		return () => {
			cleanup();
		};
	});
</script>

<svelte:window onkeydown={closeOnEscape} />

<!-- class="absolute z-10 rounded-md border-2 border-[#94ffcf] border-white bg-[#e0fff1] p-5" -->
<div
	use:focus
	role="dialog"
	tabindex={0}
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
	class="fassungen_popover z-90 absolute max-w-[500px] border-4 border-surface-500 bg-primary-400 transition-transform duration-500"
	bind:this={elPopover}
>
	<div class="py-2 px-4 flex gap-4 justify-between items-center bg-primary-500">
		<h1 class="h6">{@html title}</h1>
		<button
			class="close_button cursor-pointer"
			onclick={resetPopup}
			aria-label="Apparat schliessen"
			tabindex="0"><i class="fa-solid fa-xmark"></i></button
		>
	</div>
	<div class="p-4 pt-1">
		{#if structure_info}
			<h2 class="h5">Apparat 1</h2>
			<p class="mb-2">{@html structure_info}</p>
		{/if}
		{#if reading_info}
			<h2 class="h5">Apparat 2</h2>
			<p>{@html reading_info}</p>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.fassungen_popover :global(a) {
		@apply text-primary-800 font-bold;
	}
	.fassungen_popover :global(.note) {
		@apply italic;
	}
</style>
