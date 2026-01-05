<script>
	import { goto, preloadData } from '$app/navigation';
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

	const findthirties = async (/** @type {String | undefined} */ page) => {
		if (page) {
			return (await meta)
				.find(
					(pageMeta) =>
						pageMeta.id ===
						`${handle}${page.padStart(page[page.length - 1] === 'r' || page[page.length - 1] === 'v' ? 4 : 3, '0')}`
				)
				.l.replace('.', '/');
		}
		return '';
	};

	let getTargetUrl = async () => {
		return `${base}${targetPath}/${await findthirties(pageField?.value)}`;
	};
</script>

<form
	class="flex max-w-full items-baseline gap-1"
	onsubmit={(e) => {
		e.preventDefault();
		getTargetUrl().then((url) => {
			goto(url);
		});
	}}
>
	<p>{rvSuffix ? 'Bl.' : 'S.'}:</p>
	<input
		type="text"
		placeholder="Seite oder Blatt"
		class="input max-w-20"
		bind:this={pageField}
		bind:value={page}
	/>
	<!-- <button aria-label="anzeigen" class="btn preset-filled btn-sm shrink-0 grow-0">Anzeigen</button> -->
</form>
