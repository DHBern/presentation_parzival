<script>
	import { goto, preloadData } from '$app/navigation';
	import { base } from '$app/paths';

	/** @type {{targetPath?: string, coordinates?: [String | boolean, String | boolean]}} */
	let { targetPath = '/textzeugen/', pageId = 'd005', meta } = $props();

	$inspect(meta);
	/**
	 * @type {HTMLInputElement | undefined}
	 */
	let pageField = $state();

	let idParts = $derived(String(pageId).match(/(.*)(\d{3})([^\d]*)$/));
	let handle = $derived(idParts[1]);
	let page = $derived(`${Number(idParts[2])}${idParts[3] ? idParts[3] : ''}`);

	let getTargetUrl = () => {
		return `${base}${targetPath}/${handle}/${pageField?.value.padStart(2, '0')}${
			pageField?.value ? '-' + pageField.value : ''
		}`;
	};
	//preload data on valid input
	const preload = () => {
		if (thirties && verse && validateMinMax(thirties) && validateMinMax(verse)) {
			preloadData(getTargetUrl());
		}
	};

	function handleInput(/** @type {Event} */ e) {
		if (e.target instanceof HTMLInputElement) {
			preload();
		}
	}
</script>

<form
	class="flex max-w-full items-baseline gap-1 my-3"
	onsubmit={(e) => {
		e.preventDefault();
		goto(getTargetUrl());
	}}
>
	<p>Seite oder Blatt:{idParts}</p>
	<input
		type="text"
		placeholder="Seite oder Blatt"
		class="input max-w-20"
		bind:this={pageField}
		bind:value={page}
	/>
	<button aria-label="anzeigen" class="btn preset-filled btn-sm shrink-0 grow-0">Anzeigen</button>
</form>
