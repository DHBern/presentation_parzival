<script>
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	/** @type {{targetPath?: string, pageId?: string, meta: Array<{id: string, l: string, iiif?: any}>}} */
	let { targetPath = '/transkriptionen/d', pageId = 'd005', meta } = $props();
	/**
	 * @type {HTMLInputElement | undefined}
	 */
	let pageField = $state();

	let idParts = $derived(String(pageId).match(/(.*)(\d{3})([^\d]*)$/));
	let handle = $derived(idParts[1]);
	let rvSuffix = $derived(idParts[3]);
	let page = $derived(`${Number(idParts[2])}${rvSuffix}`);

	let currentIndex = $derived(meta.findIndex((m) => m.id === pageId));
	let prevPage = $derived(currentIndex > 0 ? meta[currentIndex - 1] : undefined);
	let nextPage = $derived(
		currentIndex >= 0 && currentIndex < meta.length - 1 ? meta[currentIndex + 1] : undefined
	);

	/** @param {{l: string}} target */
	const pageUrl = (target) => `${base}${targetPath}/${target.l.replace('.', '/')}`;

	/**
	 * Programmatically step to the previous or next page.
	 * Returns true when navigation was triggered.
	 * @param {-1 | 1} direction
	 */
	export function step(direction) {
		const target = direction < 0 ? prevPage : nextPage;
		if (!target) return false;
		goto(pageUrl(target));
		return true;
	}

	const findVerse = (/** @type {String | undefined} */ page) => {
		if (!page) return false;
		const found = meta.find((pageMeta) => {
			if (rvSuffix) {
				if (page.endsWith('r') || page.endsWith('v')) {
					return pageMeta.id === `${handle}${page.padStart(4, '0')}`;
				} else {
					return pageMeta.id === `${handle}${page.padStart(3, '0')}r`;
				}
			} else {
				return pageMeta.id === `${handle}${page.padStart(3, '0')}`;
			}
		});
		return found?.l ? found.l.replace('.', '/') : false;
	};
</script>

<div class="flex max-w-full items-baseline gap-4">
	<button
		type="button"
		class="btn-icon preset-filled"
		disabled={!prevPage}
		aria-label={`vorherige${rvSuffix ? 's Blatt' : ' Seite'}`}
		onclick={() => {
			if (prevPage) goto(pageUrl(prevPage));
		}}
	>
		<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
	</button>

	<form
		class="flex max-w-full items-baseline gap-1"
		onsubmit={(e) => {
			e.preventDefault();
			const verse = findVerse(page);
			if (verse) {
				goto(`${base}${targetPath}/${verse}`);
			} else if (pageField) {
				pageField.setCustomValidity(`${rvSuffix ? 'Blatt' : 'Seite'} nicht gefunden`);
				pageField.reportValidity();
			}
		}}
	>
		<label for="page-selector-input">{rvSuffix ? 'Blatt' : 'Seite'}:</label>
		<input
			id="page-selector-input"
			type="text"
			placeholder="Seite oder Blatt"
			class="input max-w-20 invalid:bg-error-500"
			bind:this={pageField}
			bind:value={page}
			oninput={() => {
				pageField?.validity.customError && pageField.setCustomValidity('');
			}}
		/>
		<button type="submit" class="btn btn-sm preset-filled">Blättern</button>
	</form>

	<button
		type="button"
		class="btn-icon preset-filled"
		disabled={!nextPage}
		aria-label={`nächste${rvSuffix ? 's Blatt' : ' Seite'}`}
		onclick={() => {
			if (nextPage) goto(pageUrl(nextPage));
		}}
	>
		<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
	</button>
</div>
