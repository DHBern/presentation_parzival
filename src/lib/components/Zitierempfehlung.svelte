<script>
	import Popover from './Popover.svelte';

	/**
	 * Renders the Parzival citation block.
	 *
	 * `mode` selects between an inline `<p>` and a `Popover` whose trigger is
	 * the word "Zitierempfehlung" and whose content is the inline `<p>` plus
	 * a copy-to-clipboard button. In popup mode `aria-haspopup="dialog"` is
	 * set on the trigger button.
	 *
	 * `variant` inserts a string after "Digitale Ausgabe":
	 * omitted -> nothing, `'fassungen'` -> ` nach Fassungen`,
	 * `'eintextedition'` -> `, Eintextedition`.
	 *
	 * @typedef {{
	 *   mode?: 'inline' | 'popup',
	 *   variant?: 'fassungen' | 'eintextedition'
	 * }} Props
	 */

	/** @type {Props} */
	let { mode = 'inline', variant } = $props();

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

	// Cancel any pending reset on unmount so the timeout cannot fire after teardown.
	$effect(() => () => clearTimeout(resetTimer));
</script>

{#snippet body()}
	<p bind:this={bodyElement}>
		Wolfram von Eschenbach, ›Parzival‹, Digitale Ausgabe{insert}, hg. von Michael Stolz in
		Zusammenarbeit mit Stefan Abel und einem internationalen Editionsteam, parzival.unibe.ch
		(Zugriff: [aktuelles Datum])
	</p>
{/snippet}

{#if mode === 'popup'}
	<Popover ariaHaspopup="dialog">
		{#snippet trigger()}Zitierempfehlung{/snippet}
		{#snippet content()}
			<div class="flex flex-col gap-2">
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
{:else}
	{@render body()}
{/if}
