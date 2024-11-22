<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	/** @type {{pages: any}} */
	let { pages } = $props();

	let scrollContainer = $state();
	/**
	 * @type {IntersectionObserver}
	 */
	let observer;
	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						console.log(entry.target);
					}
				});
			},
			{
				root: scrollContainer,
				rootMargin: '0px',
				threshold: [0, 1]
			}
		);
		const verse = scrollContainer?.querySelector(`[data-verse="${$page.data.thirties}.01"]`);
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

<div class="max-h-[70vh] overflow-y-auto" bind:this={scrollContainer}>
	{#each pages as page}
		<div class="thirty" use:addToObserver>
			{@html page}
		</div>
		<hr class="!border-t-4 !border-primary-500" />
	{/each}
</div>

<style>
	.thirty {
		:global(.once) {
			-webkit-animation-iteration-count: 4;
			animation-iteration-count: 4;
		}
		:global(.line) {
			display: flex;
			gap: 1em;
			margin: 0.5em 0;
		}
		:global(.tei-cb) {
			@apply text-right mr-2;
		}
		:global(.tei-cb:not(.tei-cb:first-child)) {
			@apply border-primary-300 border-solid border-t-4;
		}
	}
</style>
