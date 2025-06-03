<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let { content, titles, nextPrevButton } = $props();

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(async () => {
		// update the current page when a new verse comes into view
		observer = createObserver(true, scrollContainer, page);
	});

	const addToObserver = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			if (!correctPos) {
				const targetVerse = node.parentElement?.querySelector(
					`[data-verse="${page.data.thirties}.01"]`
				);
				if (targetVerse) {
					targetVerse?.scrollIntoView({
						behavior: 'instant',
						block: 'start'
					});
					correctPos = true;
				}
			}
			observer.observe(node);
			return () => {
				observer.unobserve(node);
			};
		});
	};
	let correctPos = false;
</script>

<div class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 my-4">
	{#each content as fassung, i}
		<h2 class="h2">{titles[i]}</h2>
	{/each}
</div>
<div
	class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-x-4 my-4 tei-content synced grid-flow-dense max-h-[70vh] overflow-y-auto"
	bind:this={scrollContainer}
>
	{#each content as fassung, i}
		{@const column = ['d', 'm', 'G', 'T'][i]}
		{#if fassung[0] && fassung[0][0] > 1}
			{@render nextPrevButton(false, fassung[0][0] - 1, column)}
		{/if}
		{#each fassung as page, j (page[0])}
			{@html page[1]}
			{#if i === 0}
				<hr class="!border-t-4 !border-primary-500 column-{column}" use:addToObserver />
			{:else}
				<hr class="!border-t-4 !border-primary-500 column-{column}" />
			{/if}
		{/each}
		{#if fassung[fassung.length - 1] && fassung[fassung.length - 1][0] < NUMBER_OF_PAGES}
			{@render nextPrevButton(true, fassung[fassung.length - 1][0] + 1, column)}
		{/if}
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	@reference "@skeletonlabs/skeleton/optional/presets";

	.synced {
		:global(.line) {
			@apply grid grid-cols-(--verse-width) grid-flow-col items-center-safe;
			@apply preset-filled-surface-500;
			:global(.verse) {
				@apply ml-1;
			}
		}
		:global(.line:first-child) {
			@apply rounded-t-xl;
		}
		@variant md {
			:global(.column-d) {
				grid-column: 1;
			}
			:global(.column-m) {
				grid-column: 2;
			}
			:global(.column-G) {
				grid-column: 3;
			}
			:global(.column-T) {
				grid-column: 4;
			}
			:global(:nth-child(1 of .column-T)),
			:global(:nth-child(1 of .column-G)),
			:global(:nth-child(1 of .column-m)),
			:global(:nth-child(1 of .column-d)) {
				@apply rounded-t-xl;
			}
			:global(:nth-last-child(1 of .column-T)),
			:global(:nth-last-child(1 of .column-G)),
			:global(:nth-last-child(1 of .column-m)),
			:global(:nth-last-child(1 of .column-d)) {
				@apply rounded-b-xl;
			}
		}
	}
</style>
