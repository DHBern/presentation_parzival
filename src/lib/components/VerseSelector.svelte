<script>
	import { goto, preloadData } from '$app/navigation';
	import { base } from '$app/paths';
	import { NUMBER_OF_PAGES } from '$lib/constants';
	import { afterNavigate } from '$app/navigation';

	/** @type {{targetPath?: string, coordinates?: [String | boolean, String | boolean]}} */
	let { targetPath = '/einzelverssynopse', coordinates = ['1', '1'] } = $props();

	//TODO: use preloadData as soon as valid data is entered

	/**
	 * @type {HTMLInputElement | undefined}
	 */
	let thirties = $state();
	/**
	 * @type {HTMLInputElement | undefined}
	 */
	let verse = $state();

	/**
	 * @type {HTMLInputElement | undefined}
	 */
	let additional = $state();

	let thirtiesVal = $derived(Number(coordinates[0]));
	let verseParts = $derived(String(coordinates[1]).split('-'));
	let verseVal = $derived(Number(verseParts[0]));
	// let additionalVal = $derived(verseParts.slice(1).join('-'));

	let targetUrl = $derived(
		`${base}${targetPath}/${thirties.value}/${verse.value.padStart(2, '0')}${
			additional?.value ? '-' + additional.value : ''
		}`
	);

	//preload data on valid input
	const preload = () => {
		if (thirties && verse && validateMinMax(thirties) && validateMinMax(verse)) {
			preloadData(targetUrl);
		}
	};

	const validateMinMax = (/** @type {HTMLInputElement} */ i) => {
		//validate if input is a Number
		if (isNaN(Number(i.value)) || i.value === '') {
			i.classList.add('input-error');
			return false;
		} else {
			//validate if input is within min and max
			if (parseInt(i.value) < parseInt(i.min) || parseInt(i.value) > parseInt(i.max)) {
				i.classList.add('input-error');
				return false;
			} else {
				i.classList.remove('input-error');
				return true;
			}
		}
	};

	function handleInput(/** @type {Event} */ e) {
		if (e.target instanceof HTMLInputElement) {
			if (validateMinMax(e.target)) {
				preload();
			}
		}
	}

	afterNavigate(() => {
		//reset additional field after navigation
		if (additional) additional.value = '';
	});
</script>

<form
	class="flex max-w-full items-baseline gap-1 my-3"
	onsubmit={(e) => {
		e.preventDefault();
		if (thirties && verse && validateMinMax(thirties) && validateMinMax(verse)) {
			goto(targetUrl);
		}
	}}
>
	<p>Vers:</p>
	{#if typeof coordinates === 'object'}
		<input
			type="number"
			placeholder="Dreißiger"
			class="input inline max-w-28"
			min="1"
			max={NUMBER_OF_PAGES}
			oninput={handleInput}
			bind:this={thirties}
			bind:value={thirtiesVal}
		/>.<input
			type="number"
			placeholder="Vers"
			class="input max-w-20"
			min="1"
			max={thirtiesVal === 257 ? 32 : 30}
			oninput={handleInput}
			bind:this={verse}
			value={verseVal}
		/>-<input type="text" placeholder="Zusatz" class="input max-w-20" bind:this={additional} />
		<button aria-label="suchen" class="btn preset-filled btn-sm shrink-0 grow-0">Anzeigen</button>
	{/if}
</form>
