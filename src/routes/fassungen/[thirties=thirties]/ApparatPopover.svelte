<script>
	import { onMount } from 'svelte';
	import { autoUpdate } from '@floating-ui/dom';
	import { computePosition, offset, flip, shift } from '@floating-ui/dom';

	let {
		resetPopup,
		elTrigger,
		autofocus = false,
		dreissiger,
		verse,
		title,
		structure_info,
		reading_info,
		onMouseEnter = () => {},
		onMouseLeave = () => {}
	} = $props();
	/** @type {HTMLElement | undefined} */
	let elPopover = $state();

	/**
	 * @param {HTMLElement} elMark
	 * @param {HTMLElement} elPopup
	 */
	function updateFunctionFloatingPopover(elMark, elPopup) {
		return () => {
			computePosition(elMark, elPopup, {
				// Floating UI's defaults: open below the anchor, flip above when there
				// is no room, then shift to stay inside the viewport. offset() adds a
				// small gap so the popover does not sit flush against the verse.
				middleware: [offset(8), flip(), shift()]
			}).then(({ x, y }) => {
				elPopup.style.top = `${y}px`;
				elPopup.style.left = `${x}px`;
				elPopup.style.display = 'block';
			});
		};
	}

	// Only popovers opened by click (pinned) grab keyboard focus. Transient
	// hover popovers must not steal focus from the reader.
	/**
	 * @param {HTMLElement} el
	 * @param {boolean} enabled
	 */
	const focus = (el, enabled) => {
		if (enabled) el.focus();
	};

	onMount(() => {
		if (!elPopover) return;
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

<!-- class="absolute z-10 rounded-md border-2 border-[#94ffcf] border-white bg-[#e0fff1] p-5" -->
<div
	use:focus={autofocus}
	role="dialog"
	aria-modal="false"
	aria-label="Apparat"
	tabindex={0}
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
	class="fassungen_popover z-90 absolute max-w-[500px] card preset-filled"
	bind:this={elPopover}
>
	<div class="py-2 px-4 flex gap-4 justify-between items-center bg-gray-400">
		<h1 class="h6">{@html title}</h1>
		<button
			class="close_button cursor-pointer"
			onclick={resetPopup}
			aria-label="Apparat schließen"
			tabindex="0"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button
		>
	</div>
	<div class="p-4 pt-1">
		{#if structure_info}
			<h2 class="h5 text-black">Apparat 1</h2>
			<p class="mb-2">{@html structure_info}</p>
		{/if}
		{#if reading_info}
			<h2 class="h5 text-black">Apparat 2</h2>
			<p>{@html reading_info}</p>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.fassungen_popover :global(a) {
		@apply anchor font-bold;
	}
	:global(.fassungen_popover .note) {
		@apply italic;
	}
</style>
