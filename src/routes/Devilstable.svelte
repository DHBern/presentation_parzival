<script>
	import { TagsInput } from '@skeletonlabs/skeleton-svelte';
	import Brush from './Brush.svelte';
	import Detail from './Detail.svelte';
	import { summaryLabel } from '$lib/constants';
	import {
		DATA_MAX,
		BRUSH_WINDOW_DEFAULT_START,
		BRUSH_WINDOW_DEFAULT_END,
		SIGLA_ORDER
	} from './Devilstable_DEFAULTS.json';
	import { offset, flip, shift, computePosition } from '@floating-ui/dom';

	const brushDimension = 200;
	const brushDimensionWithSafetyPixel = brushDimension + 1; // fixes a glitch, where Brush and Detail don't fit next to each other on PageResize.

	/** @type {{codices: any, width?: number, height?: number, data?: {values: number[][], label: string}[]}} */
	let { codices, width = 400, height = 400, data = [] } = $props();

	let mobile = $derived(width < 800);
	const defaultChips = [summaryLabel, ...SIGLA_ORDER, 'fr'];
	let inputChipValues = $state(defaultChips);
	let inputChipValueLabels = $derived(
		inputChipValues.map((v) => codices.find((c) => c.sigil === v)?.handle ?? v)
	);
	let fragments = $derived(data.filter((d) => d.label.includes('fr')));
	/** @type {{label: string, values: boolean[]}} */
	let allFragmentData = $derived.by(() => {
		if (!inputChipValueLabels.includes('fr')) return {};
		//combine all the fragments into one Object with the label 'fr'
		/** @type {{label: string, values: boolean[]|[boolean[],string]}} */
		let fragmentData = {
			label: 'fr',
			values: new Array(DATA_MAX).fill(false)
		};
		//loop DATA_MAX times and check if the value is in any of the fragments
		for (let i = 0; i < DATA_MAX; i++) {
			//check if the value is in any of the fragments
			for (let j = 0; j < fragments.length; j++) {
				//check if the value is in the range of the fragment
				if (fragments[j].values.some(([start, end]) => i + 1 >= start && i + 1 <= end)) {
					//if the value is in the range of the fragment, add the label to the array
					if (Array.isArray(fragmentData.values[i])) {
						fragmentData.values[i] = [...fragmentData.values[i], fragments[j].label];
					} else {
						fragmentData.values[i] = [fragments[j].label];
					}
				}
			}
		}
		return fragmentData;
	});
	/** @type {{label: string, values: boolean[]}[]} */
	let boolData = $derived(
		inputChipValueLabels.map((c) => {
			if (c === 'fr') {
				return allFragmentData;
			} else if (c === summaryLabel) {
				return {
					label: c,
					values: new Array(DATA_MAX).fill(true)
				};
			} else {
				const entry = data.find((d) => d.label === c);
				if (!entry) console.error(`Could not find data for ${c}`);
				/** @type {boolean[]} */ const values = new Array(DATA_MAX).fill(false);
				entry?.values.forEach(([start, end]) => {
					values.fill(true, start - 1, end);
				});

				return {
					label: c,
					values
				};
			}
		})
	);
	let selection = $state({
		start: BRUSH_WINDOW_DEFAULT_START,
		end: BRUSH_WINDOW_DEFAULT_END
	});
	let detailData = $derived(
		boolData.map(({ values, ...rest }) => ({
			values: values.slice(selection.start - 1, selection.end),
			...rest
		}))
	);
	let popupChips = $state();

	const updatePos = (base, popup) => {
		popup.style.display = 'block';
		computePosition(base, popup, {
			placement: 'top',
			middleware: [flip(), shift(), offset(6)],
			strategy: 'absolute'
		}).then(({ x, y }) => {
			Object.assign(popup.style, {
				left: `${x}px`,
				top: `${y}px`
			});
		});
	};
</script>

<div
	class="card p-4 preset-filled-primary-500 max-w-lg hidden absolute top-0 left-0"
	bind:this={popupChips}
>
	<p>
		Um Textzeugen und Fragmente zu entfernen, klicken Sie bitte auf die grau hinterlegten Kästchen.
	</p>
	<p>
		Um einen Textzeugen hinzuzufügen, geben Sie die SIgle des Textzeugen ein. Z. B. <i>D</i>.
	</p>
	<p>
		Um einzelne Fragmente hinzuzufügen geben sie <i>fr</i> gefolgt vom Index des Fragments (1-72)
		ein. Z. B.
		<i>fr32</i>. Um alle Fragmente in einer Spalte hinzuzufügen, geben Sie <i>fr</i> (ohne index) ein.
	</p>
	<div class="arrow preset-filled-primary-500"></div>
</div>
<div
	class="container mx-auto mb-6 flex flex-wrap md:flex-nowrap gap-4"
	onfocusin={(e) => updatePos(e.currentTarget, popupChips)}
	onfocusout={(e) => {
		popupChips.style.display = 'none';
	}}
>
	<TagsInput
		validate={(input) => {
			if (
				[
					summaryLabel,
					'fr',
					...codices.map((/** @type {{ sigil: string; }} */ c) => c.sigil),
					...fragments.map((/** @type {{ label: string; }} */ f) => f.label)
				].includes(input.inputValue)
			) {
				return true;
			}
			return false;
		}}
		value={inputChipValues}
		onValueChange={(e) => (inputChipValues = e.value)}
		placeholder="Textzeuge / Fragment hinzufügen..."
		name="inputChips"
	/>
	<div class=" md:-vertical preset-filled h-min m-auto">
		<button
			class="btn preset-filled"
			onclick={() => {
				inputChipValues = defaultChips;
			}}
		>
			zurücksetzen
		</button>
		<button
			class="btn preset-filled"
			onclick={() => {
				inputChipValues = [];
			}}
		>
			Alle entfernen
		</button>
	</div>
</div>
<Brush
	width={mobile ? width : brushDimension}
	height={mobile ? brushDimension : height}
	data={boolData.filter((d) => d.label !== summaryLabel)}
	bind:selection
/>
<Detail
	{codices}
	width={mobile ? width : width - brushDimensionWithSafetyPixel}
	height={mobile ? height - brushDimension : height}
	data={detailData}
	bind:selection
/>

<style>
	:global(.tick text) {
		font-size: 0.75rem;
	}
</style>
