<script>
	import VerseSelector from '$lib/components/VerseSelector.svelte';
	import TextzeugenSelector from '$lib/components/TextzeugenSelector.svelte';
	import Devilstable from './Devilstable.svelte';

	/** @type {import('./$types').PageData} */
	export let data;
	$: ({ tableData } = data);
	let tableWidth = 0;
	let tableHeight = 0;

	/**
	 * @type { String[] }
	 */
	let selectedSigla = ['', ''];
</script>

<div class="container mx-auto grid grid-cols-[repeat(auto-fit,minmax(366px,1fr))] gap-6">
	<section class="col-span-full">
		<h1 class="h1 my-20">Wolfram von Eschenbach, ›Parzival‹: Digitale Edition</h1>
		<p>
			Introtext Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet, similique quidem?
			Labore consectetur assumenda quam fugit. Alias sint nostrum, aliquam, eveniet, corporis
			ducimus necessitatibus expedita iste nihil at modi tempore!
		</p>
	</section>
	<section>
		<h2 class="h2 my-10">Versindizes zu den Textzeugen</h2>
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
		<h2 class="h2 my-10">Verssynopse</h2>
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
		<h2 class="h2 my-10">Synopse zweier Textzeugen</h2>
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
	<section>
		<h2 class="h2 my-10">Suche</h2>
		<p class="my-5">Geben Sie einen Suchbegriff ein, um in der digitalen Edition zu suchen.</p>
		<input type="text" placeholder="Suchbegriff" class="input" />
	</section>
	<section class="col-span-full">
		<h2 class="h2 my-10">Edition nach Dreißigern</h2>
		<p class="my-5">
			Aktuell sind noch die Bücher IX bis XIV (Dreißiger 433–733) in Revision; über den ganzen Text
			hin befindet sich die Interpunktion in Überarbeitung. Die folgende Tabelle führt die Dreißiger
			des ›Parzival‹ nach Lachmanns Zählung auf. Die in der Datenbank enthaltenen Fassungstexte und
			Transkriptionen der Überlieferungszeugen können durch Anklicken der Links aufgerufen werden.
			Durch Anklicken der Siglen in der obersten Leiste kann direkt zum ersten vorhandenen Dreißiger
			im jeweiligen Überlieferungszeugen gesprungen werden.
		</p>
		<div
			class="w-[calc(100vw-4rem)] mx-[calc(50%-50vw+2rem)] h-[90vh]"
			bind:clientWidth={tableWidth}
			bind:clientHeight={tableHeight}
		>
			<Devilstable
				width={tableWidth || 1000}
				height={tableHeight || 400}
				data={tableData['contiguous-ranges']}
			/>
		</div>
	</section>
</div>
