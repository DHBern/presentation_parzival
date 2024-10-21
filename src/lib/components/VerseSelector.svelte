<script>
	import { goto, preloadData } from '$app/navigation';
	import { base } from '$app/paths';

	/** @type {{targetPath?: string, coordinates?: [String | boolean, String | boolean]}} */
	let { targetPath = '/einzelverssynopse', coordinates = ['1', '1'] } = $props();

	//TODO: use preloadData as soon as valid data is entered

	/**
	 * @type {HTMLInputElement}
	 */
	let thirties = $state();
	/**
	 * @type {HTMLInputElement}
	 */
	let verse = $state();

	let additional = $state('');

	let thirtiesVal = $state(Number(coordinates[0]));

	function handleInput(/** @type {Event} */ e) {
		if (e.target instanceof HTMLInputElement) {
			validateMinMax(e.target);
		}
	}

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
</script>

<form
	class="flex max-w-full items-baseline gap-1 my-3"
	onsubmit={(e) => {
		e.preventDefault();
		if (validateMinMax(thirties) && validateMinMax(verse)) {
			goto(
				`${base}${targetPath}/${thirties.value}/${verse.value}${additional ? '-' + additional : ''}`
			);
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
			max="827"
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
			value={Number(coordinates[1])}
		/>-<input type="text" placeholder="Zusatz" class="input max-w-20" bind:value={additional} />
		<button class="btn-icon variant-filled btn-icon-sm flex-shrink-0 flex-grow-0">
			<i class="fa-solid fa-magnifying-glass"></i></button
		>
	{/if}
</form>
