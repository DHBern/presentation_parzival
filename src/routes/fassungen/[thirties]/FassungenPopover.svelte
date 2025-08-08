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

	function populateAnchorTags(string) {
		return string.replace(/<a>(.*?)<\/a>/g, (match, p1) => {
			return `<a href="/textzeugen/${p1.toLowerCase()}/${dreissiger}/${verse}">${p1}</a>`;
		});
	}

	function updateFunctionFloatingPopover(elMark, elPopup) {
		return () => {
			computePosition(elMark, elPopup, {
				middleware: [
					autoPlacement({ allowedPlacements: ['top', 'bottom'] }),
					offset(15),
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
		console.log(ev.code);
		if (ev.code == 'Escape') resetPopup();
	};

	onMount(() => {
		// close popup when Esc is pressed
		window.addEventListener('keydown', closeOnEscape);
		// Cleanup
		const cleanup = autoUpdate(
			elTrigger,
			elPopover,
			updateFunctionFloatingPopover(elTrigger, elPopover)
		);
		return () => {
			window.removeEventListener('keydown', closeOnEscape);
			cleanup();
		};
	});
</script>

<!-- class="absolute z-10 rounded-md border-2 border-[#94ffcf] border-white bg-[#e0fff1] p-5" -->
<div
	use:focus
	role="dialog"
	tabindex={0}
	onmouseenter={onMouseEnter}
	onmouseleave={onMouseLeave}
	class="fassungen_popover absolute max-w-[500px] border-4 border-surface-500 bg-primary-400 transition-transform duration-500"
	bind:this={elPopover}
>
	<div class="py-2 px-4 flex gap-4 justify-between items-center bg-primary-500">
		<h1 class="h6">{title}</h1>
		<button
			class="close_button cursor-pointer"
			onclick={resetPopup}
			aria-label="Apparat schliessen"
			tabindex="0"><i class="fa-solid fa-xmark"></i></button
		>
	</div>
	<div class="p-4 pt-6">
		{#if structure_info}
			<h2 class="h5">Apparat 1</h2>
			<p class="mb-2">{@html populateAnchorTags(structure_info)}</p>
		{/if}
		{#if reading_info}
			<h2 class="h5">Apparat 2</h2>
			<p>{@html populateAnchorTags(reading_info)}</p>
		{/if}
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.fassungen_popover :global(a) {
		@apply text-primary-800 font-bold;
	}
</style>
