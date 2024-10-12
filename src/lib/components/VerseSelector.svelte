<script>
	import { goto, preloadData } from '$app/navigation';
	import { base } from '$app/paths';

	export let targetPath = '/einzelverssynopse';
	/** @type {[String | boolean, String | boolean]} */
	export let coordinates = ['1', '1'];

	//TODO: use preloadData as soon as valid data is entered

	/**
	 * @type {HTMLInputElement}
	 */
	let thirties;
	/**
	 * @type {HTMLInputElement}
	 */
	let verse;

	let additional = '';

	let thirtiesVal = Number(coordinates[0]);

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
	$: if (thirtiesVal === 257) {
		verse.max = '32';
	} else if (verse?.max) {
		verse.max = '30';
	}
</script>

<form
	class="flex max-w-full items-baseline gap-1 my-3"
	on:submit|preventDefault={(e) => {
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
			on:input={handleInput}
			bind:this={thirties}
			bind:value={thirtiesVal}
		/>.<input
			type="number"
			placeholder="Vers"
			class="input max-w-20"
			min="1"
			max="30"
			on:input={handleInput}
			bind:this={verse}
			value={Number(coordinates[1])}
		/>-<input type="text" placeholder="Zusatz" class="input max-w-20" bind:value={additional} />
		<button class="btn-icon variant-filled btn-icon-sm flex-shrink-0 flex-grow-0">
			<i class="fa-solid fa-magnifying-glass"></i></button
		>
	{/if}
</form>
