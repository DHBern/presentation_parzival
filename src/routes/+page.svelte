<script>
	import VerseSelector from '$lib/components/VerseSelector.svelte';
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import Devilstable from './Devilstable.svelte';
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';
	import { base } from '$app/paths';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let { tableData } = $derived(data);
	let tableWidth = $state(0);
	let tableHeight = $state(0);
</script>

<div class="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-6">
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
					Eine neue kritische Ausgabe nach Fassungen mit philologischen und phylogenetischen
					Analyseverfahren inklusive Einbindung digitaler Faksimiles
				</p>
			</div>
		</div>
		<H2Hoverable name="Ankündigungen" classes="h2 my-4"></H2Hoverable>
		<p class="mb-5">
			<a
				class="anchor"
				href="https://www.parzival.unibe.ch/metapherein2024"
				title="Tagung Metapherein"
				target="_blank">Metaphérein – Theories and Methods of Stemmatology</a
			> (Wissenschaftliche Tagung Monte Verità, Ascona TI, 12.–15. Mai 2024)
		</p>
		<H2Hoverable name="Projekt-Publikationen" classes="h2 my-4"></H2Hoverable>
		<p class="mb-5">
			Michael Stolz: <a
				class="anchor"
				href="https://schwabe.ch/Michael-Stolz-Parzival-im-Manuskript-978-3-7965-4223-7"
				title="Parzival im Manuskript"
				target="_blank">Parzival im Manuskript</a
			>. Profile der Parzival–Überlieferung am Beispiel von fünf Hand-<br />schriften des 13. bis
			15. Jahrhunderts. Mit einem Beitrag von Richard F. Fasching, Basel 2020 [419 S.] [<a
				class="anchor"
				href="{base}/4086_8_Titelflyer_Stolz_Parzival.pdf"
				title="Flyer Parzival im Manuskript"
				target="_blank">Flyer</a
			>]
		</p>
		<p class="mb-5">
			Projektbeitrag Michael Stolz: <a
				class="anchor"
				href="{base}/Stolz_Wolfr18_SD.pdf"
				target="_blank">[gemeinsam mit Elke Brüggen:] Fassungen, Übersetzung und Kommentar.</a
			> Profile einer neuen Ausgabe von Wolframs ›Parzival‹, in: Walther von der Vogelweide. Düsseldorfer
			Kolloquium 2018, hg. von Ricarda Bauschke und Veronika Hassel in Verbindung mit Franz-Josef Holznagel
			und Susanne Köbele, Berlin 2020 (Wolfram-Studien 26), S. 469–491.
		</p>
		<p class="mb-5">
			Projektbeitrag Michael Stolz: <a
				class="anchor"
				href="{base}/Stolz_Eintext16_SD-1.pdf"
				target="_blank">Von den Fassungen zur Eintextedition.</a
			>
			Eine neue Leseausgabe <br />von Wolframs ›Parzival‹, in: Überlieferungsgeschichte
			transdisziplinär, in Verbindung mit Horst Brunner und Freimut Löser hg. von Dorothea Klein,
			Wiesbaden 2016 (Wissensliteratur im Mittelalter 52), S. 353–388.
		</p>
		<p class="mb-5">
			Projektbeitrag Michael Stolz: <a
				class="anchor"
				href="{base}/Stolz_Wolfr12_SD.pdf"
				target="_blank">Chrétiens ›Roman de Perceval‹ und Wolframs ›Parzival‹.</a
			> <br />Ihre Überlieferung und textkritische Erschließung, in: Wolframs Parzival-Roman im
			europäischen Kontext. Tübinger Kolloquium 2012, in Verbindung mit Susanne Köbele und Eckart
			Conrad Lutz hg. von Klaus Ridder, Berlin 2014 (Wolfram-Studien 23), S. 431–478.
		</p>
		<p class="mb-5">
			<a
				class="anchor"
				href="http://www.philhist.unibe.ch/studium/studienprogramme/master_editionsphilologie/index_ger.html"
				target="_blank">Masterstudienprogramm „Editionsphilologie”</a
			> an der Universität Bern
		</p>
	</section>
	<section>
		<H2Hoverable name="Versindizes zu den Textzeugen" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Die Indizes listen die Start- bzw. Endverse je Seite und Spalte für einen Textzeugen auf. Der
			anzuzeigende Textzeuge kann aus der Liste ausgewählt und durch "Index anzeigen" aufgerufen
			werden.
		</p>

		<select class="select">
			<option value="1">Textzeuge auswählen</option>
			<option value="2">G</option>
			<option value="3">D</option>
			<option value="4">m</option>
			<option value="5">Fr</option>
		</select>
	</section>
	<section>
		<H2Hoverable name="Verssynops" classes="h2 my-10"></H2Hoverable>
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
			<TextzeugenSelector sigla={[...data.codices, ...data.fragments]} />
		</div>
	</section>
	<section class="col-span-full">
		<H2Hoverable name="Edition nach Dreißigern" classes="h2 my-10"></H2Hoverable>
		<p class="my-5">
			Aktuell befindet sich noch die Interpunktion in Überarbeitung (Dreißiger 201 bis 472). Die
			Tabelle ermöglicht die Auswahl von Dreißigern der synoptischen FassungsEdition nach
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
