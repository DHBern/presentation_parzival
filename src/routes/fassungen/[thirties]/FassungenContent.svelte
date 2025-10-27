<script>
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import createObserver from './observer';

	let {
		pages,
		resetPopup = () => {},
		scrolltop = $bindable(),
		nextPrevButton,
		title,
		distribution
	} = $props();

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	let activeThirties = $state({ value: page.data.thirties });
	onMount(() => {
		// update the current page when a new verse comes into view
		observer = createObserver(false, scrollContainer, page, activeThirties);
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
</script>

<div class="mb-4 min-h-24">
	<h2 class="h2 inline">{title}</h2>
	<div class="inline [&_ul,&_li]:inline [&_li]:mr-1">
		{@html distribution[activeThirties.value]}
	</div>
</div>
<div
	class="max-h-[70vh] overflow-y-auto bg-gray-100 dark:preset-filled-surface-500"
	bind:this={scrollContainer}
	onscroll={() => {
		resetPopup();
	}}
>
	{#if pages[0][0] > 1}
		{@render nextPrevButton(false, pages[0][0] - 1)}
	{/if}
	{#each pages as page (page[0])}
		<div class="thirty tei-content" use:addToObserver>
			{@html page[1]}
		</div>
		<hr class="!border-t-4 !border-primary-500" />
	{/each}
	{#if pages[pages.length - 1][0] < NUMBER_OF_PAGES}
		{@render nextPrevButton(true, pages[pages.length - 1][0] + 1)}
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
