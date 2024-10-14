<script context="module">
	import { writable } from 'svelte/store';
	let targetVerse = writable('');

	export function setTarget(/** @type {string} */ verse) {
		targetVerse = writable(verse);
	}
</script>

<script>
	import { createEventDispatcher, onMount } from 'svelte';
	export let pages;

	let localVerse = $targetVerse;
	/**
	 * @type {number | undefined}
	 */
	let timer;

	const dispatch = createEventDispatcher();

	let scrollContainer, observer;

	onMount(() => {
		observer = new IntersectionObserver(
			(entries) => {
				if (programmaticScroll) return;
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						dispatch('localPageChange', entry.target.dataset);
					}
				});
			},
			{
				root: scrollContainer,
				rootMargin: '0px',
				threshold: [0, 1]
			}
		);
	});

	let programmaticScroll = false;

	const onScrollEnd = (/** @type { Event & { target: HTMLElement}} } */ e) => {
		if (programmaticScroll) {
			programmaticScroll = false;
		} else {
			clearTimeout(timer);
			timer = setTimeout(() => {
				const positive = (/** @type {string} */ verse) => {
					localVerse = verse;
					$targetVerse = verse;
					dispatch('localVerseChange', verse);
				};
				const /** @type { NodeListOf<HTMLElement> } */ verses =
						e.target?.querySelectorAll('.verse');
				let found = false;
				for (let i = 0; i < verses.length; i++) {
					const verse = verses[i];
					if (
						verse.getBoundingClientRect().top === e.target.getBoundingClientRect().top &&
						verse.dataset.verse
					) {
						positive(verse.dataset.verse);
						found = true;
						break;
					}
				}
				if (!found) {
					for (let i = 0; i < verses.length; i++) {
						const verse = verses[i];
						if (
							verse.getBoundingClientRect().top >= e.target.getBoundingClientRect().top &&
							verse.dataset.verse
						) {
							positive(verse.dataset.verse);
							break;
						}
					}
				}
			}, 100);
		}
	};

	const scrollToVerse = (/** @type {HTMLDivElement} */ node, /** @type {String} */ targetVerse) => {
		const scroll = (/** @type {String} */ target) => {
			const verse = node.parentElement?.querySelector(`[data-verse="${target}"]`);
			if (!verse) return;
			programmaticScroll = true;
			// verse.scrollIntoView({ behavior: 'instant', block: 'start' });
			scrollContainer?.scrollTo({
				top:
					scrollContainer?.scrollTop +
					Number(verse.parentElement?.getBoundingClientRect().top) -
					scrollContainer?.getBoundingClientRect().top,
				behavior: 'instant'
			});
			dispatch('localVerseChange', target);
			verse.parentElement?.classList.add('animate-bounce', 'once');
		};
		scroll(targetVerse);

		observer.observe(node);

		return {
			/**
			 * @param {String} targetVerse
			 */
			update(targetVerse) {
				if (targetVerse === localVerse) return;
				scroll(targetVerse);
			},
			destroy() {}
		};
	};
	// returns true when the column is empty or when it contains only children that are empty or themselves have empty children (recursively)
	const isEmptyColumn = (/** @type {String} */ column) => {
		const parser = new DOMParser();
		const doc = parser.parseFromString(column, 'text/html');
		const children = doc.body.children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.children.length === 0) {
				if (child.textContent?.trim() !== '') {
					return false;
				}
			} else {
				if (!isEmptyColumn(child.innerHTML)) {
					return false;
				}
			}
		}
		return true;
	};
</script>

<div
	class="max-h-[70vh] overflow-y-auto snap-y"
	on:scrollend={onScrollEnd}
	bind:this={scrollContainer}
>
	{#if pages}
		{#each pages as pageObject (pageObject.id)}
			{#await pageObject.tpData}
				Lade Seite...
			{:then tpData}
				{@const pageColumns = tpData.content.split('<br class="tei-cb">')}
				<div
					class="page"
					data-id={pageObject.id}
					data-next={tpData.nextId}
					data-previous={tpData.previousId}
					use:scrollToVerse={$targetVerse}
				>
					{#each pageColumns as column}
						{#if !isEmptyColumn(column)}
							<div class="column">{@html column}</div>
						{/if}
					{/each}
				</div>
				<hr class="!border-t-4" />
			{:catch error}
				{error.message}
			{/await}
		{/each}
	{/if}
</div>

<style>
	.column :global(.line) {
		@apply snap-start;
		display: flex;
		gap: 1em;
		margin: 0.5em 0;
	}

	.column :global(.once) {
		-webkit-animation-iteration-count: 4;
		animation-iteration-count: 4;
	}
</style>
