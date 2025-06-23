<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let { pages, scrolltop = $bindable(), nextPrevButton } = $props();

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(() => {
		// update the current page when a new verse comes into view
		observer = createObserver(false, scrollContainer, page);
		const verse = scrollContainer?.querySelector(`[data-verse="${page.data.thirties}.01"]`);
		if (verse) {
			scrollContainer?.scrollTo({
				top:
					scrollContainer?.scrollTop +
					Number(verse.parentElement?.getBoundingClientRect().top) -
					scrollContainer?.getBoundingClientRect().top,
				behavior: 'instant'
			});
		} else {
			console.log('no verse found');
		}
	});

	const addToObserver = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			observer.observe(node);
			return () => {
				observer.unobserve(node);
			};
		});
	};

	const setSyncedScroll = (/** @type {HTMLDivElement} */ node) => {
		$effect(() => {
			if (scrolltop && node.scrollTop !== scrolltop) {
				node.scrollTo({ top: scrolltop, behavior: 'instant' });
			}
		});
	};
</script>

<div
	class="max-h-[70vh] overflow-y-auto preset-filled-surface-500 rounded-xl"
	bind:this={scrollContainer}
	onscroll={(/** @type {{ target: { scrollTop: any; }; }} */ o) => {
		scrolltop = o?.target?.scrollTop;
	}}
	use:setSyncedScroll
>
	{#if pages[0][0] > 1}
		{@render nextPrevButton(true, pages[0][0] - 1)}
	{/if}
	{#each pages as page (page[0])}
		<div class="thirty tei-content" use:addToObserver>
			{@html page[1]}
		</div>
		<hr class="!border-t-4 !border-primary-500" />
	{/each}
	{#if pages[pages.length - 1][0] < NUMBER_OF_PAGES}
		{@render nextPrevButton(false, pages[pages.length - 1][0] + 1)}
	{/if}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	@reference "@skeletonlabs/skeleton";
	.thirty {
		:global(.once) {
			-webkit-animation-iteration-count: 4;
			animation-iteration-count: 4;
		}
		:global(.line) {
			@apply flex ml-1;
			:global(.verse) {
				@apply w-(--verse-width) shrink-0;
			}
		}
		:global(.tei-cb) {
			@apply text-right mr-2;
		}
		:global(.tei-cb:not(.tei-cb:first-child)) {
			@apply border-primary-300 border-solid border-t-4;
		}
	}
</style>
