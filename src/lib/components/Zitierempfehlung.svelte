<script module>
	import { citations, findCitation, findPageCitation } from '$lib/data/citations';

	const citationData = await citations;
</script>

<script>
	import { onDestroy } from 'svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import doiLogo from '$lib/assets/DOI_logo.svg';
	import Popover from './Popover.svelte';

	/**
	 * Renders the Parzival citation block.
	 *
	 * `mode` selects between an inline `<p>` and a `Popover` with a responsive
	 * DOI button that adapts to its allocated container width, containing
	 * the inline `<p>` plus
	 * a copy-to-clipboard button. In popup mode `aria-haspopup="dialog"` is
	 * set on the trigger button.
	 *
	 * `variant` inserts a string after "Digitale Ausgabe":
	 * omitted -> nothing, `'fassungen'` -> ` nach Fassungen`,
	 * `'eintextedition'` -> `, Eintextedition`.
	 * `citationSlug` selects an exact registry slug (e.g. `transkriptionen/d`).
	 * Otherwise the page's first path segment is used, or `parzival` on the homepage.
	 * `citationId` explicitly
	 * selects project records with empty slugs. Registry data is shared through
	 * a module-level fetch promise, like the other API data modules.
	 * `citationDoi` supplies a witness DOI from metadata; null means unavailable
	 * and deliberately prevents fallback to the current page's registry entry.
	 *
	 * @typedef {{
	 *   mode?: 'inline' | 'popup',
	 *   citationSlug?: string,
	 *   citationId?: string,
	 *   citationDoi?: string | null,
	 *   variant?: 'fassungen' | 'eintextedition'
	 * }} Props
	 */

	/** @type {Props} */
	let { mode = 'inline', variant, citationSlug, citationId, citationDoi } = $props();

	const citation = $derived.by(() => {
		if (citationDoi !== undefined) {
			if (!citationDoi) {
				return undefined;
			}

			return {
				citation_doi: citationDoi,
				citation_scope: 'Transkription'
			};
		}

		if (citationId || citationSlug !== undefined) {
			return findCitation(citationData.citations, {
				slug: citationSlug,
				id: citationId
			});
		}

		return findPageCitation(citationData.citations, page.url, base);
	});
	const lookupError = $derived(citationDoi === undefined && citationData.citationsError);
	const doi = $derived(citation?.citation_doi.replace('https://doi.org/', ''));

	const insert = $derived(
		variant === 'fassungen'
			? ' nach Fassungen'
			: variant === 'eintextedition'
				? ', Eintextedition'
				: ''
	);

	/** @type {'idle' | 'success' | 'error'} */
	let copyStatus = $state('idle');
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let resetTimer;
	/** @type {HTMLParagraphElement | null} */
	let bodyElement = $state(null);

	function scheduleReset() {
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => {
			copyStatus = 'idle';
		}, 2000);
	}

	async function copyCitation() {
		try {
			await navigator.clipboard.writeText(bodyElement?.textContent ?? '');
			copyStatus = 'success';
		} catch {
			// Clipboard API can reject in insecure contexts or when permission
			// is denied. Surface the failure inline so the user can fall back to
			// manual selection.
			copyStatus = 'error';
		}
		scheduleReset();
	}

	onDestroy(() => clearTimeout(resetTimer));
</script>

{#snippet body()}
	<p bind:this={bodyElement}>
		Wolfram von Eschenbach, ›Parzival‹, Digitale Ausgabe{insert}, hg. von Michael Stolz in
		Zusammenarbeit mit Stefan Abel und einem internationalen Editionsteam, parzival.unibe.ch
		(Zugriff: [aktuelles Datum]){#if citation}
			{citation.citation_scope ? `${citation.citation_scope}: ` : ''}
			<a class="anchor" href={citation.citation_doi}>{citation.citation_doi}</a>
		{/if}
	</p>
{/snippet}

{#if mode === 'popup'}
	<div class="@container/citation flex flex-[0_1_25rem] w-100 min-w-15 max-w-full justify-end">
		<Popover
			ariaHaspopup="dialog"
			ariaLabel={doi ? `Zitierempfehlung: ${doi}` : 'Zitierempfehlung'}
			triggerClass="btn preset-tonal min-h-11 gap-2 whitespace-nowrap"
		>
			{#snippet trigger()}
				{#if doi}
					<img src={doiLogo} alt="" width="28" height="28" class="shrink-0" />
					<span class="hidden sm:@min-[14rem]/citation:inline">
						zitierempfehlung<span class="hidden @min-[25rem]/citation:inline">: {doi}</span>
					</span>
				{:else}
					<span>Zitierempfehlung</span>
				{/if}
			{/snippet}
			{#snippet content()}
				<div class="flex flex-col gap-2">
					{#if lookupError}
						<p role="status">Die DOI-Zitierdaten konnten nicht geladen werden.</p>
					{/if}
					<div class="flex items-start gap-3">
						<div class="min-w-0">{@render body()}</div>
						<button
							type="button"
							onclick={copyCitation}
							aria-label={copyStatus === 'success'
								? 'Zitierempfehlung kopiert'
								: 'Zitierempfehlung in die Zwischenablage kopieren'}
							title="In die Zwischenablage kopieren"
							class="btn-icon preset-filled-surface-50-950 shrink-0"
						>
							{#if copyStatus === 'success'}
								<i class="fa-solid fa-check" aria-hidden="true"></i>
							{:else}
								<i class="fa-solid fa-copy" aria-hidden="true"></i>
							{/if}
						</button>
					</div>
					{#if copyStatus === 'error'}
						<p aria-live="polite" class="text-sm">
							Kopieren fehlgeschlagen. Bitte den Text manuell markieren und kopieren.
						</p>
					{/if}
				</div>
			{/snippet}
		</Popover>
	</div>
{:else}
	{@render body()}
	{#if lookupError}
		<p role="status">Die DOI-Zitierdaten konnten nicht geladen werden.</p>
	{/if}
{/if}
