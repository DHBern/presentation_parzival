<script>
	import VerseSelector from '$lib/components/VerseSelector.svelte';
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import Devilstable from './Devilstable.svelte';
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let { tableData } = $derived(data);
	let tableWidth = $state(0);
	let tableHeight = $state(0);
</script>

<div class="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 gap-x-20">
	<section class="col-span-full">
		<div class="mt-20 mb-4">
			<h1 class="h1">Wolfram von Eschenbach, ›Parzival‹: Digitale Edition</h1>
			<small>
				Ein Projekt des Schweizerischen Nationalfonds und der Deutschen Forschungsgemeinschaft
			</small>
		</div>
		<div class="bg-[url('$lib/assets/G063v.jpg')] bg-cover">
			<div
				class="md:flex flex-row-reverse items-center md:[&_picture]:flex-shrink-0 max-w-3xl mx-auto"
			>
				<enhanced:img
					src="$lib/assets/G049v-freigestellt.gif"
					alt="Portrait"
					class="w-full h-auto my-4 md:h-[20rem] md:w-auto"
				/>
				<p class="text-primary-500 font-bold pb-4 px-4">
					Kritische Ausgabe nach Fassungen mit philologischen und phylogenetischen
					Analyseverfahren mit Einbindung digitaler Faksimiles
				</p>
			</div>
		</div>
	</section>
	<section>
		<H2Hoverable name="Verssynopse" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Es werden Einzelverse in sämtlichen Textzeugen und (optional) Fassungen angezeigt. Bitte geben
			Sie im ersten Feld die Zahl eines Dreißigers (z. B. 249), im zweiten Feld die Zahl eines
			Verses (z. B. 1 oder 14) ein. In Ausnahmefällen kann im zweiten Feld zusätzlich die Angabe von
			Zusatzversen getrennt durch einen Bindestrich erfolgen (z. B. bei 796.28-1 oder 796.28-1-01).
			Hinweis: Die Epilogverse (Ep) in V und V' sowie die Prologverse (Pr) in V werden in der
			Verssynopse nicht berücksichtigt.
		</p>
		<div class="flex max-w-full items-baseline gap-1 my-3">
			<VerseSelector targetPath="/einzelverssynopse" />
		</div>
	</section>
	<section>
		<H2Hoverable name="Synopse zweier Textzeugen" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Die beiden Textzeugen können aus den Listen ausgewählt werden; der gewünschte Versbereich ist
			in die Eingabefelder einzutragen. Der Startvers wird jeweils durch zwei Eingaben bestimmt: die
			Zahl des Dreißigers (›Parzival‹), das Kürzel "NP" (für den ›Nuwen Parzifal‹ in den
			Handschriften V oder V') oder das Kürzel "Ep" (für den Epilog in den Handschriften V und V'),
			danach die Zahl des Verses.
		</p>
		<div>
			<TextzeugenSelector />
		</div>
	</section>
	<section class="col-span-full">
		<H2Hoverable name="Edition nach Dreißigern" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Die Tabelle ermöglicht die Auswahl von Dreißigern der synoptischen FassungsEdition nach
			Dreißigern) und Handschriftentranskriptionen (unter den einzelnen Siglen). Die Fragmente sind
			in der Spalte rechts außen nach Dreißigern aufgeführt. Alle Textzeugen können auch einzeln
			über das untenstehende Feld angewählt und entfernt werden.
		</p>
		<div
			class="w-[calc(100vw-4rem)] mx-[calc(50%-50vw+2rem)] h-[90vh]"
			bind:clientWidth={tableWidth}
			bind:clientHeight={tableHeight}
		>
			<Devilstable
				codices={data.codices}
				width={tableWidth || 1000}
				height={tableHeight || 400}
				data={tableData['contiguous-ranges']}
			/>
		</div>
	</section>
</div>
