<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let { sigla } = $derived(data);
	let hoveredH2 = $state({ value: null });
</script>

<div class="container mx-auto typography">
	<h1 class="h1">Parzival-Handschriften und Fragmente zu den Editionsproben</h1>
	{#each [...sigla.codices, ...sigla.fragments] as { "handle": handle, "sigil": sigil, "info-h1": info_h2, "info-h2": loc, info }}
		<!-- set the id of h2 (for fraction use handles, for codices use case-sensitive sigils) -->
		{@const id = handle[0] === 'f' ? handle : sigil}
		<H2Hoverable bind:hoveredH2 {id}>{@html info_h2}</H2Hoverable>
		<div class="[&_ul]:!list-none [&_ul]:!pl-0 [&_li]:font-bold">
			{@html loc}
		</div>
		{#if info}
			<p>{@html info}</p>
		{/if}
	{/each}
	<H2Hoverable bind:hoveredH2 id="Referenzen"
		>Zu dieser Liste der Handschriften vergleiche man:</H2Hoverable
	>
	<ul>
		<li>
			Günter Kochendörfer/ Bernd Schirok: Maschinelle Textrekonstruktion. Theoretische Grundlegung,
			praktische Erprobung an einem Ausschnitt des ›Parzival‹ Wolframs von Eschenbach und Diskussion
			der literaturgeschichtlichen Ergebnisse, Göppingen 1976 (Göppinger Arbeiten zur Germanistik
			185), S. 112–119
		</li>
		<li>
			Peter Jörg Becker: Handschriften und Frühdrucke mittelhochdeutscher Epen. Eneide, Tristrant,
			Tristan, Erec, Iwein, Parzival, Willehalm, Jüngerer Titurel, Nibelungenlied und ihre
			Reproduktion und Rezeption im späteren Mittelalter und in der frühen Neuzeit, Wiesbaden 1977
		</li>
		<li>
			Gesa Bonath/ Helmut Lomnitzer: Verzeichnis der Fragment-Überlieferung von Wolframs ›Parzival‹,
			in: Studien zu Wolfram von Eschenbach. FS Werner Schröder zum 75. Geburtstag, hrsg. v. Kurt
			Gärtner/ Joachim Heinzle, Tübingen 1989, S. 87–149
		</li>
		<li>
			Joachim Heinzle: Klassiker-Edition heute, in: Methoden und Probleme der Edition
			mittelalterlicher deutscher Texte. Bamberger Fachtagung 26.–29. Juni 1991. Plenumsreferate,
			hrsg. v. Rolf Bergmann/ Kurt Gärtner u. a., Tübingen 1993 (Beihefte zu editio 4), S. 50–62
		</li>
		<li>
			Bernd Schirok: Parzivalrezeption im Mittelalter, Darmstadt 1982 (Erträge der Forschung 174),
			S. 30–56
		</li>
		<li>
			Bernd Schirok: Parzival III.1. Die Handschriften und die Entwicklung des Textes, in: Wolfram
			von Eschenbach. Ein Handbuch, hg. von Joachim Heinzle, 2 Bde., Berlin/ Boston 2011, Bd. 1, S.
			308–334
		</li>
		<li>
			Thomas Franz Schneider und Gabriel Viehhauser: Zwei Neufunde zu Wolframs von Eschenbach
			›Parzival‹. Teil 2: Das dreispaltige Solothurner Fragment F 69. Ein Vertreter der
			'Nebenfassung' *m, in: Wolfram-Studien 20 (2008), S. 457–525 (mit Abdruck) und Abb. 5–40
		</li>
		<li>
			Wolfram von Eschenbach, Parzival. Abbildungen und Transkriptionen zur gesamten
			handschriftlichen Überlieferung des Prologs, hrsg. v. Uta Ulzen, Göppingen 1974 (Litterae 34)
		</li>
		<li>
			Wolfram von Eschenbach, Parzival. Studienausgabe. Mittelhochdeutscher Text nach der sechsten
			Ausgabe von Karl Lachmann. Übersetzung von Peter Knecht. Einführung zum Text von Bernd
			Schirok, Berlin/ New York 1998
		</li>
		<li>
			<a href="http://www.handschriftencensus.de/" target="_blank">
				Handschriftencensus deutschsprachiger Handschriften des 13. und 14. Jahrhunderts
			</a>
		</li>
	</ul>
	<p>
		Die Handschriften-Siglen entsprechen den Angaben bei Klaus Klein: Beschreibendes Verzeichnis der
		Handschriften, in: Wolfram von Eschenbach. Ein Handbuch, hg. von Joachim Heinzle, 2 Bde.,
		Berlin/ Boston 2011, Bd. 2, S. 941–1002, hier: 943–959 [in Klammern die Siglen der Systematik
		nach Hartl (Studienausgabe von Schirok, S. XXVIIff.)].
	</p>
	<p>
		Die Fragmentbezeichnung in Ziffern schließt sich G. Bonath/H. Lomnitzer, Verzeichnis der
		Fragment-Überlieferung, an [in Klammern ältere Siglen (vgl. u. a. Ulzen, S. VIf.)].
	</p>
</div>
