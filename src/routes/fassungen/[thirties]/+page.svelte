<script>
	import FassungenSyncContent from './FassungenSyncContent.svelte';
	import FassungenContent from './FassungenContent.svelte';
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import FassungenPopover from './FassungenPopover.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let verseWidth = $derived(page.data.thirties.length + 4);

	const composureTitles = ['*D', '*m', '*G', '*T'];
	const composureTitlesByColumn = { d: '*D', m: '*m', G: '*G', T: '*T' };
	class localPageClass {
		/**
		 * for the Fassungen *d, *m, *G and *T
		 * @type {[[number, string][],[number, string][],[number, string][],[number, string][]]}
		 */
		pages = $state([[], [], [], []]);
		distributions = $state([{}, {}, {}, {}]);
		/**
		 * @type {Number[]}
		 */
		thirties = [];

		reset = () => {
			this.pages = [[], [], [], []];
			this.thirties = [];
		};

		/**
		 * Fetches data for the specified page number.
		 * @param {Number} page - The page number to fetch data for.
		 * @returns {Promise<void>} - A promise that resolves when the data is fetched.
		 */
		fetchPage = async (/** @type {Number} */ page) => {
			const prepareHTML = (info, /** @type {string} */ column) => {
				// select all lines in the HTML and process them
				const parser = new DOMParser();
				const doc = parser.parseFromString(info.content, 'text/html');
				// The reducer will...
				// 1. transform the input array into an object array by...
				// 	 a. grouping by the key
				//   b. glowing strings together for repeating key (separated by linebreak)
				// 2. escape any occurence of " inside the strings, since they would break data-attributes attachment (not tested, since this is to prevent a hypothetical bug)
				const reducer = (acc, object) => {
					for (const [key, value] of Object.entries(object)) {
						if (value) {
							acc[key] = (acc[key] ?? '') + value.replace('"', `&quot;`) + '<br/>';
						}
					}
					return acc;
				};
				const condensedReading = info.reading.reduce(reducer, {});
				const condensedStructure = info.structure.reduce(reducer, {});
				const lines = doc.querySelectorAll('div.line');
				lines.forEach((line) => {
					line.classList.add(`column-${column}`);
					const verseNode = line.querySelector('[data-verse]');
					if (verseNode) {
						const verse = verseNode.getAttribute('data-verse')?.split('.')[1];
						if (verse) {
							const reading_info = condensedReading[verse];
							const structure_info = condensedStructure[verse];
							if (reading_info || structure_info) {
								const parts = verseNode.innerHTML.split('.');
								if (parts.length > 1) {
									const beforeDot = parts[0] + '.';
									const afterDot = parts[1];
									verseNode.innerHTML = `${beforeDot}<a
									class="anchor"
									href="#verse-${verse}"
									data-structure_info="${structure_info ? structure_info : ''}"
									data-reading_info="${reading_info ? reading_info : ''}"
									data-dreissiger=${parts[0]}
									data-verse=${verse.replace(/^0+/, '')}
									data-title="${composureTitlesByColumn[column] + ' ' + beforeDot + verse.replace(/^0+/, '')}"
									>${afterDot}</a>`;
								} else {
									//!! This does not seem to work (LAB)
									verseNode.innerHTML = `<a class="anchor" href="#verse-${verse}">${verseNode.innerHTML}</a>`;
								}
							}
						}
					}
				});
				return Array.from(lines)
					.map((line) => line.outerHTML)
					.join('');
			};
			let labels = ['d', 'm', 'G', 'T'];
			// if the page is not already loaded
			if (!this.thirties.length) {
				let content;
				// fetch the page before the current one if the current one is not the first
				if (page > 1) {
					content = await fetch(`${base}/fassungen/data/${page - 1}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page - 1, preparedHTML]);
						this.distributions[index][page - 1] = content[index].distribution;
					});
					this.thirties.push(page - 1);
				}
				// fetch the current page
				if (page <= NUMBER_OF_PAGES) {
					content = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page, preparedHTML]);
						this.distributions[index][page] = content[index].distribution;
					});
					this.thirties.push(page);
				}
				// fetch the page after the current one if the current one is not the last
				if (page !== NUMBER_OF_PAGES) {
					content = await fetch(`${base}/fassungen/data/${page + 1}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page + 1, preparedHTML]);
						this.distributions[index][page + 1] = content[index].distribution;
					});
					this.thirties.push(page + 1);
				}
				if (page > NUMBER_OF_PAGES) {
					console.error('Page out of bounds');
				}
			} else {
				if (page < this.thirties[0] && !this.thirties.includes(page)) {
					let content = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].unshift([page, preparedHTML]);
						this.distributions[index][page] = content[index].distribution;
					});
					this.thirties.unshift(page);
				} else if (page > this.thirties[this.thirties.length - 1]) {
					let content = await fetch(`${base}/fassungen/data/${page}`).then((r) => r.json());
					labels.forEach((label, index) => {
						let preparedHTML = prepareHTML(content[index], label);
						this.pages[index].push([page, preparedHTML]);
						this.distributions[index][page] = content[index].distribution;
					});
					this.thirties.push(page);
				} else if (page === this.thirties[0] && page > 1) {
					this.fetchPage(page - 1);
				} else if (page === this.thirties[this.thirties.length - 1] && page !== NUMBER_OF_PAGES) {
					this.fetchPage(page + 1);
				}
			}
			tick().then(() => {
				addTriggerListeners();
			});
			return Promise.resolve();
		};
	}

	let localPages = new localPageClass();
	$effect(() => {
		localPages.fetchPage(Number(data.thirties));
	});
	let synchro = $state(true);
	let windowWidth = $state(0);
	/**@type {boolean|CSSStyleDeclaration} **/ let styles = $state(false);
	let mobileBreakpoint = $derived.by(() => {
		if (typeof styles === 'object') {
			return (
				windowWidth / (16 * Number(styles.getPropertyValue('--text-scaling'))) >=
				parseInt(styles.getPropertyValue('--breakpoint-md'))
			);
		}
		return false;
	});
	onMount(() => {
		styles = getComputedStyle(document.documentElement);
	});

	// PopoverStore containing the content of the selected popover
	let FassungenPopoverStore = $state({
		elTrigger: undefined,
		dreissiger: '',
		verse: '',
		title: '',
		structure_info: '',
		reading_info: ''
	});

	// Event Listeners for Popovers
	let timeoutonMouseLeaveTrigger = $state();
	let timeoutonMouseLeavePopup = $state();
	let ignoreLeave = $state(false);

	const fillFassungenPopoverStore = (elTrigger, ignore = false) => {
		if (!ignore) {
			resetFassungenPopoverStore();
			const data = elTrigger.dataset;
			FassungenPopoverStore.elTrigger = elTrigger;
			FassungenPopoverStore.title = data.title;
			FassungenPopoverStore.dreissiger = data.dreissiger;
			FassungenPopoverStore.verse = data.verse;
			FassungenPopoverStore.structure_info = data.structure_info;
			FassungenPopoverStore.reading_info = data.reading_info;
		}
	};
	const resetFassungenPopoverStore = () => {
		FassungenPopoverStore.elTrigger = undefined;
		FassungenPopoverStore.title = '';
		FassungenPopoverStore.dreissiger = '';
		FassungenPopoverStore.verse = '';
		FassungenPopoverStore.structure_info = '';
		FassungenPopoverStore.reading_info = '';
	};

	// const popover = document.querySelector('fassungen_popover');
	const clearTimeouts = () => {
		clearTimeout(timeoutonMouseLeaveTrigger);
		clearTimeout(timeoutonMouseLeavePopup);
	};

	const onClickTrigger = (ev) => {
		ignoreLeave = true;
		fillFassungenPopoverStore(ev.target, false);
	};
	const onMouseEnterTrigger = (ev) => {
		clearTimeouts(); // prevents diappearing popover when user hovers multiple triggers before hovering the popover
		fillFassungenPopoverStore(ev.target, ignoreLeave);
	};
	const onMouseLeaveTrigger = () => {
		if (!ignoreLeave) {
			timeoutonMouseLeaveTrigger = setTimeout(resetFassungenPopoverStore, 500);
		}
	};
	const onMouseEnterPopover = () => {
		clearTimeouts();
	};
	const onMouseLeavePopover = () => {
		if (!ignoreLeave) {
			timeoutonMouseLeavePopup = setTimeout(resetFassungenPopoverStore, 500);
		}
	};

	const addTriggerListeners = () => {
		removeTriggerListeners();
		document.querySelectorAll('.anchor').forEach((el) => {
			el.addEventListener('mouseenter', onMouseEnterTrigger, false);
			el.addEventListener('mouseleave', onMouseLeaveTrigger, false);
			el.addEventListener('click', onClickTrigger, false);
		});
	};
	const removeTriggerListeners = () => {
		document.querySelectorAll(`.anchor`).forEach((el) => {
			el.removeEventListener('mouseenter', onMouseEnterTrigger);
			el.removeEventListener('mouseleave', onMouseLeaveTrigger);
			el.removeEventListener('click', onClickTrigger);
		});
	};
	const closePopupOnInteraction = () => {
		resetFassungenPopoverStore();
		clearTimeouts();
		ignoreLeave = false;
	};

	$effect(() => {
		// add eventListeners when synchro is switched
		synchro;
		addTriggerListeners();
	});

	$effect(() => {
		if (!mobileBreakpoint) {
			synchro = false;
		}
	});
	let gotoThirties = $state(Number(data.thirties));
</script>

<svelte:window bind:innerWidth={windowWidth} />
<section id="sectionFassungen" class="w-full" style="--verse-width: {verseWidth}ch">
	{#snippet nextPrevButton(next, page, column)}
		<button
			class="btn preset-filled-primary-500 w-full mb-4 {column ? 'column-' + column : ''}"
			onclick={() =>
				goto(`${base}/fassungen/${page}`, {
					noScroll: true,
					keepFocus: true,
					replaceState: true
				})}
		>
			{next ? 'Nächsten Dreißiger anzeigen' : 'vorherigen Dreißiger anzeigen'}
		</button>
	{/snippet}
	<h1 class="h1 my-4">Fassungsansicht</h1>
	<div class="grid gap-6 md:grid-cols-2 md:my-8">
		<p>Einstellungen und Links zu den Textzeugen.</p>

		{#if mobileBreakpoint}
			<Switch
				controlActive="bg-primary-500"
				name="synchro"
				checked={synchro}
				onCheckedChange={(e) => (synchro = e.checked)}>Synchrones scrollen</Switch
			>
		{/if}
		<form
			onsubmit={(e) => {
				e.preventDefault();
				localPages.reset();
				goto(`${base}/fassungen/${gotoThirties}`);
			}}
			class="col-start-2"
		>
			<label for="goto-thirties" class="block text-lg font-bold font-serif mb-2"
				>Zu Dreißiger springen</label
			>
			<input
				id="goto-thirties"
				type="number"
				placeholder="Dreißiger"
				class="input inline max-w-28"
				min="1"
				max={NUMBER_OF_PAGES}
				bind:value={gotoThirties}
			/>
			<button aria-label="suchen" class="btn preset-filled-primary-500">Anzeigen</button>
		</form>
	</div>

	<!-- Apparat Popover -->
	{#if FassungenPopoverStore.elTrigger}
		<FassungenPopover
			resetPopup={closePopupOnInteraction}
			onMouseEnter={onMouseEnterPopover}
			onMouseLeave={onMouseLeavePopover}
			elTrigger={FassungenPopoverStore.elTrigger}
			dreissiger={FassungenPopoverStore.dreissiger}
			verse={FassungenPopoverStore.verse}
			title={FassungenPopoverStore.title}
			structure_info={FassungenPopoverStore.structure_info}
			reading_info={FassungenPopoverStore.reading_info}
		/>
	{/if}

	<!-- Fassungen Content -->
	{#if synchro}
		<FassungenSyncContent
			resetPopup={closePopupOnInteraction}
			content={localPages.pages}
			distributions={localPages.distributions}
			titles={composureTitles}
			{nextPrevButton}
		/>
	{:else}
		<div class="grid md:grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 my-4">
			{#each localPages.pages as fassung, i}
				<div>
					{#if fassung.length >= 2}
						<!-- when at least 2 pages are loaded, the one for the currect thirties should be loaded aswell  -->
						<FassungenContent
							resetPopup={closePopupOnInteraction}
							pages={fassung}
							distribution={localPages.distributions[i]}
							title={composureTitles[i]}
							{nextPrevButton}
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</section>
