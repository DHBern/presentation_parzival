<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';

	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
	let { sigla } = $derived(data);
</script>

<svelte:head>
	<title>Textzeugen</title>
</svelte:head>

<div class="container mx-auto typography">
	<h1 class="h1">Verzeichnis der Textzeugen des ›Parzival‹</h1>

	<p>
		Die Siglen der im Folgenden aufgelisteten Textzeugen von Wolframs ›Parzival‹ – 16 (mehr oder
		weniger vollständige) Handschriften, 1 Wiegendruck und 72 Handschriftenfragmente – entsprechen
		den Angaben bei <a href="#klein">Klein 2011</a>, S. 943–959, die Siglen in runden Klammern
		folgen der Systematik bei
		<a href="#hartl">Hartl 1952</a>, S. XLIV–LXIII. Die fortlaufende Zählung der Fragmente schließt
		sich <a href="#bonath">Bonath/Lomnitzer 1989</a> an, mit den älteren Siglen in runden Klammern
		nach <a href="#ulzen">Ulzen 1974</a>, S. VIf. Die Fassungszugehörigkeit einiger Textzeugen, die
		in der Edition eindeutig einer Fassung zugeordnet worden sind, ist unsicher und entsprechend
		markiert, z.B. Fr. 2 („wohl *D“). Die einzelnen Abschnitte enthalten ggf. Verweise vor allem auf
		den Handschriftencensus und weitere online-Datenbanken sowie auf bestehende Digitalfaksimiles.
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
			Peter Jörg Becker: Handschriften und Frühdrucke mittelhochdeutscher Epen. Eneide, Tristrant,
			Tristan, Erec, Iwein, Parzival, Willehalm, Jüngerer Titurel, Nibelungenlied und ihre
			Reproduktion und Rezeption im späteren Mittelalter und in der frühen Neuzeit, Wiesbaden 1977.
		</li>
		<li id="bonath">
			Gesa Bonath und Helmut Lomnitzer: Verzeichnis der Fragment-Überlieferung von Wolframs
			›Parzival‹, in: Studien zu Wolfram von Eschenbach. FS Werner Schröder zum 75. Geburtstag, hg.
			von Kurt Gärtner und Joachim Heinzle, Tübingen 1989, S. 87–149.
		</li>
		<li>
			Joachim Heinzle: Klassiker-Edition heute, in: Methoden und Probleme der Edition
			mittelalterlicher deutscher Texte. Bamberger Fachtagung 26.–29. Juni 1991. Plenumsreferate,
			hg. von Rolf Bergmann, Kurt Gärtner u.a., Tübingen 1993 (Beihefte zu editio 4), S. 50–62.
		</li>
		<li id="klein">
			Klaus Klein: Beschreibendes Verzeichnis der Handschriften, in: Wolfram von Eschenbach. Ein
			Handbuch, hg. von Joachim Heinzle, 2 Bde., Berlin/Boston 2011, Bd. 2, S. 941–1002.
		</li>
		<li>
			Günter Kochendörfer und Bernd Schirok: Maschinelle Textrekonstruktion. Theoretische
			Grundlegung, praktische Erprobung an einem Ausschnitt des ›Parzival‹ Wolframs von Eschenbach
			und Diskussion der literaturgeschichtlichen Ergebnisse, Göppingen 1976 (Göppinger Arbeiten zur
			Germanistik 185), S. 112–119.
		</li>
		<li>
			Bernd Schirok: Parzivalrezeption im Mittelalter, Darmstadt 1982 (Erträge der Forschung 174),
			S. 30–56.
		</li>
		<li>
			Bernd Schirok: Parzival III.1. Die Handschriften und die Entwicklung des Textes, in: Wolfram
			von Eschenbach. Ein Handbuch, hg. von Joachim Heinzle, 2 Bde., Berlin/Boston 2011, Bd. 1, S.
			308–334.
		</li>
		<li>
			Thomas Franz Schneider und Gabriel Viehhauser: Zwei Neufunde zu Wolframs von Eschenbach
			›Parzival‹. Teil 2: Das dreispaltige Solothurner Fragment F 69. Ein Vertreter der
			'Nebenfassung' *m, in: Wolfram-Studien 20 (2008), S. 457–525 (mit Abdruck) und Abb. 5–40.
		</li>
		<li id="ulzen">
			Wolfram von Eschenbach, Parzival. Abbildungen und Transkriptionen zur gesamten
			handschriftlichen Überlieferung des Prologs, hg. von Uta Ulzen, Göppingen 1974 (Litterae 34).
		</li>
		<li id="hartl">
			Wolfram von Eschenbach von Karl Lachmann, 7. Ausgabe. Neu bearbeitet und mit einem Verzeichnis
			der Eigennamen und Stammtafeln versehen, Bd. 1: Lieder, Parzival, Titurel, hg. von Eduard
			Hartl, Berlin 1952.
		</li>

		<li>
			Wolfram von Eschenbach, Parzival. Studienausgabe. Mittelhochdeutscher Text nach der sechsten
			Ausgabe von Karl Lachmann. Übersetzung von Peter Knecht. Einführung zum Text von Bernd
			Schirok, Berlin/New York 1998.
		</li>
		<li>
			Wolfram von Eschenbach: ›Parzival‹, Überlieferung (Handschriftencensus) – <a
				href="http://www.handschriftencensus.de/werke/437"
				target="_blank">Handschriftencensus</a
			>. Eine Bestandsaufnahme der handschriftlichen Überlieferung deutschsprachiger Texte des
			Mittelalters.
		</li>
	</ul>

	<p>
		Zusammengestellt von Mirjam Geissbühler, Robert Mohr, Robert Schöller und Michael Stolz; zuletzt
		geändert am 18. Februar 2026.
	</p>
</div>
