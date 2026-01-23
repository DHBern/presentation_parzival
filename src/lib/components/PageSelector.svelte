<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	/** @type {{targetPath?: string, coordinates?: [String | boolean, String | boolean]}} */
	let { targetPath = '/textzeugen/d', pageId = 'd005', meta } = $props();
	/**
	 * @type {HTMLInputElement | undefined}
	 */
	let pageField = $state();

	let idParts = $derived(String(pageId).match(/(.*)(\d{3})([^\d]*)$/));
	let handle = $derived(idParts[1]);
	let rvSuffix = $derived(idParts[3]);
	let page = $derived(`${Number(idParts[2])}${rvSuffix}`);

	const findVerse = async (/** @type {String | undefined} */ page) => {
		if (page) {
			const found = (await meta).find(
				(pageMeta) =>
					pageMeta.id ===
					`${handle}${page.padStart(page[page.length - 1] === 'r' || page[page.length - 1] === 'v' ? 4 : 3, '0')}`
			);
			if (found?.l) {
				return found?.l.replace('.', '/');
			}
		}
		return false;
	};

	let getTargetUrl = async () => {
		const verse = await findVerse(page);
		if (verse) {
			return `${base}${targetPath}/${verse}`;
		} else {
			return false;
		}
	};
</script>

<form
	class="flex max-w-full items-baseline gap-1"
	onsubmit={(e) => {
		e.preventDefault();
		getTargetUrl().then((url) => {
			if (url) {
				goto(url);
			} else {
				//invalid page input
				if (pageField) {
					pageField.setCustomValidity(`${rvSuffix ? 'Blatt' : 'Seite'} nicht gefunden`);
					pageField.reportValidity();
				}
			}
		});
	}}
>
	<p>{rvSuffix ? 'Blatt' : 'Seite'}:</p>
	<input
		type="text"
		placeholder="Seite oder Blatt"
		class="input max-w-20 invalid:bg-error-500"
		bind:this={pageField}
		bind:value={page}
		oninput={() => {
			pageField?.validity.customError && pageField.setCustomValidity('');
		}}
	/>
</form>
