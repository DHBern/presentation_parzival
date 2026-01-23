<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let { sigla } = $derived(data);
</script>

<div class="container mx-auto typography">
	<h1 class="h1">Verzeichnis der Textzeugen des ›Parzival‹</h1>

	<p>
		Die Siglen der im Folgenden aufgelisteten Textzeugen von Wolframs ›Parzival‹ – 16 (mehr oder
		weniger vollständige) Handschriften, 1 Wiegendruck und 72 Handschriftenfragmente – entsprechen
		den Angaben bei KLEIN 2011, S. 943–959, die Siglen in runden Klammern folgen der Systematik bei
		HARTL 1952, S. XLIV–LXIII. Die fortlaufende Zählung der Fragmente schließt sich BONATH/LOMNITZER
		1989 an, mit den älteren Siglen in runden Klammern nach ULZEN 1974, S. VIf. Die
		Fassungszugehörigkeit einiger Textzeugen, die in der Edition eindeutig einer Fassung zugeordnet
		worden sind, ist unsicher und entsprechend markiert, z.B. Fr. 2 („wohl *D“). Die einzelnen
		Abschnitte enthalten ggf. Verweise vor allem auf den Handschriftencensus und weitere
		online-Datenbanken sowie auf bestehende Digitalfaksimiles.
	</p>

	{#each [...sigla.codices, ...sigla.fragments] as { "handle": handle, "sigil": sigil, "info-h1": info_h2, "info-h2": loc, info }}
		<!-- set the id of h2 (for fraction use handles, for codices use case-sensitive sigils) -->
		{@const id = handle[0] === 'f' ? handle : sigil}
		<H2Hoverable {id}>{@html info_h2}</H2Hoverable>
		<div class="[&_ul]:!list-none [&_ul]:!pl-0 [&_li]:font-bold">
			{@html loc}
		</div>
		{#if info}
			<p>{@html info}</p>
		{/if}
	{/each}

	<H2Hoverable id="Referenzen">Zu dieser Liste der Handschriften vergleiche man:</H2Hoverable>
	<ul>
		<li>
			Kochendörfer, Günter / Schirok, Bernd: Maschinelle Textrekonstruktion. Theoretische
			Grundlegung, praktische Erprobung an einem Ausschnitt des ›Parzival‹ Wolframs von Eschenbach
			und Diskussion der literaturgeschichtlichen Ergebnisse, Göppingen 1976 (Göppinger Arbeiten zur
			Germanistik 185), S. 112–119.
		</li>
		<li>
			Peter Jörg Becker: Handschriften und Frühdrucke mittelhochdeutscher Epen. Eneide, Tristrant,
			Tristan, Erec, Iwein, Parzival, Willehalm, Jüngerer Titurel, Nibelungenlied und ihre
			Reproduktion und Rezeption im späteren Mittelalter und in der frühen Neuzeit. Wiesbaden 1977.
		</li>
		<li>
			Bonath, Gesa / Lomnitzer, Helmut: Verzeichnis der Fragment-Überlieferung von Wolframs
			›Parzival‹. In: Studien zu Wolfram von Eschenbach. FS Werner Schröder zum 75. Geburtstag, hg.
			von Kurt Gärtner und Joachim Heinzle. Tübingen 1989, S. 87–149
		</li>
		<li>
			Heinzle, Joachim: Klassiker-Edition heute. In: Methoden und Probleme der Edition
			mittelalterlicher deutscher Texte. Bamberger Fachtagung 26.–29. Juni 1991. Plenumsreferate,
			hg. von Rolf Bergmann, Kurt Gärtner u. a. Tübingen 1993 (Beihefte zu editio 4), S. 50–62.
		</li>
		<li>
			Klein, Klaus: Beschreibendes Verzeichnis der Handschriften. In: Wolfram von Eschenbach. Ein
			Handbuch, hg. von Joachim Heinzle, 2 Bde. Berlin / Boston 2011, Bd. 2, S. 941–1002.
		</li>
		<li>
			Bernd Schirok, Bern: Parzivalrezeption im Mittelalter. Darmstadt 1982 (Erträge der Forschung
			174), S. 30–56.
		</li>
		<li>
			Schirok, Bernd: Parzival III.1. Die Handschriften und die Entwicklung des Textes. In: Wolfram
			von Eschenbach. Ein Handbuch, hg. von Joachim Heinzle, 2 Bde. Berlin/ Boston 2011, Bd. 1, S.
			308–334.
		</li>
		<li>
			Schneider, Thomas Franz / Viehhauser, Gabriel: Zwei Neufunde zu Wolframs von Eschenbach
			›Parzival‹. Teil 2: Das dreispaltige Solothurner Fragment F 69. Ein Vertreter der
			'Nebenfassung' *m. In: Wolfram-Studien 20 (2008), S. 457–525 (mit Abdruck) und Abb. 5–40.
		</li>
		<li>
			Wolfram von Eschenbach, Parzival. Abbildungen und Transkriptionen zur gesamten
			handschriftlichen Überlieferung des Prologs, hg. von Uta Ulzen. Göppingen 1974 (Litterae 34).
		</li>
		<li>
			Wolfram von Eschenbach von Karl Lachmann, 7. Ausgabe. Neu bearbeitet und mit einem
			Verzeichnis der Eigennamen und Stammtafeln versehen, Bd. 1: Lieder, Parzival, Titurel, hg.
			von Eduard Hartl. Berlin 1952.
		</li>

		<li>
			Wolfram von Eschenbach, Parzival. Studienausgabe. Mittelhochdeutscher Text nach der sechsten
			Ausgabe von Karl Lachmann. Übersetzung von Peter Knecht. Einführung zum Text von Bernd
			Schirok. Berlin/ New York 1998.
		</li>
		<li>
			Wolfram von Eschenbach: ›Parzival‹, Überlieferung (Handschriftencensus) – <a
				href="http://www.handschriftencensus.de/werke/437"
				target="_blank"
			>
				Handschriftencensus</a
			>. Eine Bestandsaufnahme der handschriftlichen Überlieferung deutschsprachiger Texte des
			Mittelalters.
		</li>
	</ul>
</div>
