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
					Kritische Ausgabe nach Fassungen mit philologischen und phylogenetischen Analyseverfahren
					mit Einbindung digitaler Faksimiles
				</p>
			</div>
		</div>
	</section>
	<section>
		<H2Hoverable name="Verssynopse" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Es werden Einzelverse in sämtlichen Textzeugen und (optional) Fassungen angezeigt. Bitte geben
			Sie im ersten Feld die Nummer eines Dreißigers von 1 bis 827, im zweiten Feld die Nummer eines
			Verses von 1 bis 30 bzw. 32 (im Fall des Dreißigers 257) ein. Im dritten Feld kann zusätzlich
			die Angabe von Zusatzversen oder Überschriften getrennt durch einen Bindestrich erfolgen (z.
			B. bei 796.28-1 oder 796.28-1-01). Hinweis: Die Epilogverse (Ep) in den Hss. V und V' (827.30<sup
				>1–580</sup
			>) sowie die Prologverse (Pr) in Hs. V (112.12<sup>1–496</sup>) können über die Angabe der
			Zusatzverse im Anschluss an 827.30 bzw. 112.12 abgerufen werden. Der ›Nuwe Parzifal‹ in den
			Hss. V oder V' ist hier nicht berücksichtigt, kann jedoch über die Einträge der beiden
			Handschriften im Textzeugenverzeichnis aufgerufen werden.
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
			Nummer des Dreißigers von 1 bis 827 (›Parzival‹), danach die Nummer des Verses. Im dritten
			Feld kann zusätzlich die Angabe von Zusatzversen oder Überschriften getrennt durch einen
			Bindestrich erfolgen (z. B. bei 796.28-1 oder 796.28-1-01). Hinweis: Die Epilogverse (Ep) in
			den Hss. V und V' (827.30<sup>1–580</sup>) sowie die Prologverse (Pr) in Hs. V (112.12<sup
				>1–496</sup
			>) können über die Angabe der Zusatzverse im Anschluss an 827.30 bzw. 112.12 abgerufen und
			entsprechend als Startverse gesetzt werden. Der ›Nuwe Parzifal‹ in den Hss. V oder V' ist hier
			nicht berücksichtigt, kann jedoch über die Einträge der beiden Handschriften im
			Textzeugenverzeichnis aufgerufen werden.
		</p>
		<div>
			<TextzeugenSelector />
		</div>
	</section>
	<section class="col-span-full">
		<H2Hoverable name="Edition nach Dreißigern" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Die Tabelle ermöglicht die Auswahl von Dreißigern der synoptischen Fassungsedition und
			Transkriptionen der Textzeugen des ›Parzival‹ (unter den einzelnen Siglen). Die Fragmente sind
			in der Spalte rechts außen nach Dreißigern aufgeführt. Textzeugen und Fragmente können über
			Mausklick auf das ‚x‘ rechts neben den Siglen aus der Tabelle entfernt werden. Um einen
			Textzeugen hinzuzufügen, wird die Sigle des Textzeugen eingegeben, z. B. ‚D‘ bzw. bei Fragmenten
			‚fr‘, gefolgt vom Index des Fragments (1–72), z. B. fr32; die Eingabe ‚fr‘ fügt alle Fragmente
			in einer Spalte hinzu.
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
