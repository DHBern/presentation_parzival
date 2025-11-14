<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';
	import Popover from '$lib/components/Popover.svelte';
</script>

<div class="container mx-auto typography tei-content">
	<h1 class="h1 mb-4">Erläuterungen zur Fassungsedition und zu den Transkriptionen</h1>
	<H2Hoverable name="Fassungsedition"></H2Hoverable>

	<p>
		Die Anlage der Fassungsedition ist an den von Karl Lachmann eingeführten Dreißigergruppen
		(Einheiten von jeweils 30 Versen) orientiert. Pro Dreißiger ist eine Ansicht der synoptisch
		angeordneten Fassungen *D, *m, *G und *T abrufbar. Kontextuell werden jedem Dreißiger jeweils
		sechs Verse des vorausgehenden und folgenden Dreißigers angefügt.
	</p>

	<p>
		In der obersten Zeile sind mit Angabe der Siglen Transkriptionen aller für den jeweiligen
		Dreißiger relevanten Textzeugen abrufbar. Am rechten Rand der Leiste stehen Downloads der
		Dreißiger in verschiedenen Formaten (wie xml) zur Verfügung; über Einstellungen lässt sich die
		Darstellung der Fassungsansicht anpassen; ferner bestehen Links bzw. ein Auswahlmenu für den
		Zugang zu benachbarten bzw. beliebigen Dreißigern sowie ein Link zur Startseite.
	</p>

	<p>
		In den Spalten der synoptisch geordneten Fassungstexte bietet eine Siglenleiste Angaben zu den
		der jeweilgen Fassung zugeordneten Textzeugen; bei den Fragmenten sind über einen Mausklick
		Hinweise zu den gegebenenfalls nur partiell erhaltenen Versen abrufbar. Optional lassen sich die
		einzelnen Fassungen auch ausblenden.
	</p>

	<p>
		Die Fassungstexte sind in normalisierter Form nach der jeweiligen Leithandschrift eingerichtet:
		Fassung *D nach Hs. D (St. Gallen, Stiftsbibliothek, Cod. 857), Fassung *m nach Hs. m (Wien,
		Österreichische Nationalbibliothek, Cod. 2914), Fassung *G nach Hs. G (München, Bayerische
		Staatsbibliothek, Cgm 19), Fassung *T nach Hs. T (Wien, Österreichische Nationalbibliothek, Cod.
		2708), in den Dreißigern 36 bis 157 wegen Vorlagenwechsels in Hs. T nach Hs. U (Wien,
		Österreichische Nationalbibliothek, Cod. 2775), in den Dreißigern 573 bis 599 und 643 bis 678
		wegen Textausfalls in den Hss. T und U nach Hs. Q (Karlsruhe, Badische Landesbibliothek,
		Donaueschingen 70). Der Wechsel der Leithandschrift ist markiert durch die Angabe *T (U) bzw. *T
		(Q).
	</p>

	<p>
		Textänderungen gegenüber der Leithandschrift sind durch Kursivierung bezeichnet.
		Gliederungsmittel der Leithandschrift wie Initialen (rot, fett, größere Schrift, z. B.: <span
			class="tei-seg9 initial Farbe: rot">W</span
		>an), Versalien (schwarz, fett, größere Schrift, z. B.: <span class="large-variant">D</span>iz)
		oder Majuskeln (Großschreibung) werden auch im normalisierten Text wiedergegeben.
	</p>

	<p>Die zwischen den Fassungstexten bestehenden Varianten sind durch Fettmarkierung angezeigt.</p>

	<p>
		Binnenvarianz innerhalb der einzelnen Fassungen ist durch Apparateinträge dokumentiert, die über
		einen Mausklick auf die jeweilige Versziffer (folgend auf die Dreißigerangabe) abrufbar sind:
		Apparat 1 bietet Angaben zur Materialität der Textzeugen (Gliederungsauszeichnungen wie
		Initialien, Versalien, Majuskeln; Überschriften und Illustrationen); Apparat 2 gewährt Auskunft
		über sinnunterscheidende Varianten.
	</p>

	<p>
		Der am Ende eines Verses hochgestellte Buchstabe <sup class="fasskommanchor multi">K</sup> verweist
		auf editorische Kommentare, die über einen Mausklick abrufbar sind. Rote Farbe bezeichnet fassungsübergreifende
		Kommentare, grüne Farbe fassungsinterne Kommentare.
	</p>

	<H2Hoverable name="Eintextedition (Krit. Edition im PDF-Format)"></H2Hoverable>

	<p>
		Die Eintextedition stellt ein Kondensat der Fassungsedition dar; diese kann stets durch einen
		Klick auf die Dreißigerziffer am linken oberen Rand erreicht werden. Der kritische Text ist nach
		Fassung *D auf der Grundlage des St. Galler Codex 857 eingerichtet.
	</p>

	<p>
		Die in der Fassungsedition fett markierten Varianten sind in einer etwas kleineren Schrifttype
		rechts neben dem Fassungstext übernommen – und zwar nur die Varianten der Fassungen *G und *T,
		die wie Fassung *D aus der ersten Hälfte des 13. Jahrhunderts stammen (zur Berücksichtigung der
		Fassung *m im Apparat vgl. unten). Wörter mit mehr als drei Buchstaben, die keine Varianten
		darstellen, werden abgekürzt.
	</p>

	<p>
		Der am Ende eines Verses hochgestellte Buchstabe K verweist auf editorische Kommentare (*D
		betreffend sowie fassungsübergreifend mit Beteilung von *D), die über die Fassungsedition per
		Mausklick abrufbar sind.
	</p>

	<p>
		Unterhalb des kritischen Textes befinden sich drei Apparatetagen: Die erste listet, geordnet
		nach Fassungen, die Auswahl der Textzeugen auf, die bei der Angabe der Fassungsvarianten
		berücksichtigt werden (neben den Leithandschriften D, m, G und T bzw. U und Q weitere
		vollständige Handschriften [LUVZ] und gegebenenfalls Fragmente aus der Zeit bis zur Mitte des
		13. Jhs., sowie das *m-Fr. 69, die aus textgeschichtlicher Perspektive als besonders wichtig
		erachtet werden). Die zweite Apparatetage beinhaltet Angaben zur materiellen Gestalt der
		ausgewählten Textzeugen (Initialen, Majuskeln sowie gegebenenfalls Überschriften und
		Illustrationen). Die dritte Apparatetage dokumentiert Abweichungen der Leithandschrift D
		gegenüber dem konstituierten *D-Text und verzeichnet auch Varianten der als sekundär zu
		erachtenden (da wohl dem späteren 13. Jahrhundert entstammenden) Fassung *m. Bei Bedarf werden
		noch weitere Einzellesarten in dieser dritten Apparatetage verzeichnet. *G*T-Lesarten, die aus
		Platzgründen nicht in der rechten Spalte angeführt werden können, werden ebenfalls auf der
		dritten Apparatetage verschoben; ein nach unten gerichteter Pfeil (↓) weist darauf hin.
	</p>

	<p>
		Angaben in Klammern bieten Spezifizierungen: Im Fassungsapparat am rechten Rand werden damit
		Ausschlüsse des Typs „nur T“, „ohne L“ sowie Lesarten einzelner Textzeugen verzeichnet. Im
		Textzeugenapparat (erste Etage) beziehen sie sich auf Abweichungen im Versumfang.
	</p>

	<p>
		Das Buchsymbol () in Kombination mit dem Hinweispfeil (↓) macht auf Besonderheiten im Verhältnis
		von Wolframs ›Parzival‹ zu den altfranzösischen Vorlagen aufmerksam; dies betrifft die Hss. L
		und vor allem V.
	</p>

	<p>
		Plusverse in Hs. V werden bis zu einem Umfang von 54 Versen aufgeführt und die Plusverse bei
		längeren Blöcken mit hochgestellten Exponenten in 5er-Schritten durchnummeriert. Sowohl auf den
		Einschub von 496 Versen nach 112.12 als auch auf den Einschub von 74 Versen nach 772.30 verweist
		jeweils ein Link (in blauer Farbe) auf die Transkription von Hs. V, Bl. 17vb–20rb bzw. 308rb–va.
	</p>

	<H2Hoverable name="Transkriptionen (auch relevant für die Darstellung in der Verssynopse)"
	></H2Hoverable>

	<p>Die Ergänzung -1, -2, -3 usw. am Ende einer Versnummer bezeichnet einen Plusvers.</p>

	<p>
		Die Ergänzungen -0 bzw. -01, -02, -03 kennzeichnen Paratexte (auch Bilder), wobei alle
		Überschriften mit -01 versehen sind.
	</p>

	<p>
		Paratexte wie Notizen, Marginalien, Kustoden und Reklamanten werden kursiviert wiedergegeben.
	</p>

	<p>Doppelt auftretende Verse erhalten die Ergänzung -r.</p>

	<p>
		Die Ergänzung -a kennzeichnet Verse, die im Zusammenhang mit Kürzungen abweichen. Spezialfall R:
		-a wird verwendet für Verse, die aufgrund der für Hs. R spezifischen Versdoppelungen abweichen.
	</p>

	<p>
		Die Ergänzung -k kennzeichnet kontrahierte Verse, welche eine Mischung aus mehreren Versen
		darstellen.
	</p>

	<p>
		Verse, die Teil einer Versumstellung sind, werden am Versende mit einem vertikalen Doppelpfeil
		(↕) markiert.
	</p>

	<p>
		Zeilenumbrüche (ausserhalb der Konvention von abgesetzten Versen) werden mit einem senkrechten
		Strich (|) markiert. Worttrennungen mit Trennungszeichen werden mit =| wiedergegeben.
	</p>

	<div>
		<h4 class="h4">Initialen</h4>
		<p>
			Initialen: rot, größere Schrift.
		</p>

		<div class="relative border rounded-xl p-4 bg-surface-50 shadow-sm mt-6">

			<!-- link label -->
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/5/29?"
				target="_blank"
				class="absolute -top-3 left-4 bg-surface-50 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				D 5.29
			</a>

			<div class="mt-2">
			<span class="tei-content">
				<span class="content">
					<span class="tei-seg9 initial Farbe: rot">D</span>o clagete man in ſere.
				</span>
			</span>
			</div>

		</div>
	</div>

	<div>
		<h4 class="h4">Prachtinitialen</h4>
		<p>
			Prachtinitialen: rot, größere Schrift, Goldhintergrund.
		</p>

		<div class="relative border rounded-xl p-4 bg-surface-50 shadow-sm mt-6">

			<!-- link label -->
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/1/01-01?"
				target="_blank"
				class="absolute -top-3 left-4 bg-surface-50 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				D 1.1
			</a>

			<div class="mt-2">
			<span class="tei-content">
				<span class="content">
					<span class="tei-seg8 glory-initial">I</span>ST zwiuel h<span class="tei-choice1">(er)</span>zen nahgebur
				</span>
			</span>
			</div>

		</div>
	</div>

	<p>
		Nicht ausgeführte Initialen: rot, kleinere Schrift. Hat der Schreiber den Initialbuchstaben
		vorgeschrieben, wird dieser eingesetzt (z. B.: DArnach), in allen anderen Fällen steht der
		Stellvertreter x (z. B.: <span class="tei-seg1 not-executed">x</span>er).
	</p>

	<p>
		Auszeichnungen in den Handschriften (Rubrizierungen u. a.): orangefarbig (z. B.: <span
			class="tei-hi1 red rot">G</span
		>amuret).
	</p>

	<p>
		Versalien und Majuskeln werden in Fettdruck wiedergegeben (z. B.: <span
			class="tei-seg7 majuscule">D</span
		>iz).
	</p>

	<p>Überschriften: rotfarbig (z. B.: <span class="tei-hi1 red rot">Her parcifal</span>).</p>

	<div>
		<h4 class="h4">Vom Schreiber ausgeführte Korrekturen</h4>
		<p>Das korrigierte Wort weist hellgraue Farbe auf (für
			unlesbare Buchstaben steht *), das Korrekturresultat wird in grüner Farbe angezeigt.
		</p>

		<div class="relative border rounded-xl p-4 bg-surface-50 shadow-sm mt-6">

			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/747/18?"
				target="_blank"
				class="absolute -top-3 left-4 bg-surface-50 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				D 747.18
			</a>
			<div class="mt-2">
		<span class="tei-content">
			<span class="content">
				<span class="tei-subst2 subst_sr">
					<span class="tei-del2 deleted">daz</span>
					<span class="tei-add2 added">
						da<span class="tei-hi3 rasure rasur"><span class="tei-gap5 gap">-*-</span></span>
					</span>
				</span>
				mvͦz glichiv ſcanze ſten.
			</span>
		</span>
			</div>
		</div>
	</div>

	<p>
		Von einem späteren Korrektor ausgeführte Korrekturen: Das korrigierte Wort weist hellgraue Farbe
		auf (für unlesbare Buchstaben steht *), das Korrekturresultat wird in türkiser Farbe (z. B.:
		<span class="tei-subst1 subst_ls"
			><span class="tei-del2 deleted">demut</span><span class="tei-add2 added"
				><span class="tei-hi3 rasure rasur">demuͦt</span></span
			></span
		>) angezeigt.
	</p>

	<p>
		Von einem späteren Korrektor ausgeführte Nachträge: türkise Farbe (z. B. <span class="subst_ls"
			>vohet hie sine kintheit an</span
		>).
	</p>

	<p>
		Wenn die Korrekturen durch Rasur erfolgen, stehen die korrigierten Buchstaben und Wörter auf
		dunkelgrauem Hintergrund (z. B.: Dar <span class="tei-subst1 subst_ls"
			><span class="tei-del2 deleted">*</span><span class="tei-add2 added"
				><span class="tei-hi3 rasure rasur"> inne</span></span
			></span
		>).
	</p>

	<p>
		Ersatzlos getilgte Wörter werden in grauer Farbe und durchgestrichen wiedergegeben (z. B.: <span
			class="del_sr">hie</span
		>). Die Zeichenfolge
		<span class="tei-subst1 subst_ls"
			><span class="tei-del2 deleted">+</span><span class="tei-add2 added"
				><span class="tei-hi3 rasure rasur"><span class="tei-gap5 gap">-*-</span></span></span
			></span
		> (z. B. in V, 141.16) steht für ein ersatzlos getilgtes Kreuz, das die Funktion einer Marginalie
		einnimmt.
	</p>

	<p>
		Diakritische Zeichen werden als solche dargestellt. Zirkumflex wird grundsätzlich gemäß der
		Handschrift transkribiert. Ausnahme: Zirkumflex über Diphthongen und mehr als zwei Vokalen in
		Folge wird stets über dem ersten Vokal wiedergegeben.
	</p>

	<p>
		Superskripte, die nicht eindeutig identifizierbar sind, werden als übergeschriebene "x" (z. B.:
		uͯ) wiedergegeben.
	</p>

	<p>
		Unlesbare Zeichen werden mit : bei einem, mit :: bei zwei und mit ::: bei drei oder mehr
		unleserlichen Buchstaben angegeben. Textverlust aufgrund materieller Beeinträchtigung (z. B.
		Fragmentverlust) wird in jedem Fall mit ::: bezeichnet.
	</p>

	<p>
		Wenn der materielle Befund des Textzeugen von der Darstellung der digitalen Reproduktion
		abweicht, wird ersterer in der Transkription berücksichtigt (z. B. in Fragment 5, Bl. 4rc, Vers
		446.3, wo das Reimwart <i>zal</i> in der Reproduktion auf einem umgeklappten Seitenteil steht und
		nicht sichtbar ist).
	</p>

	<p>
		Die Abkürzungen werden in runden Klammern aufgelöst. Hierbei ist zu beachten, dass vn̅ in jedem
		Textzeugen dem Quantitätsprinzip entsprechend mit vn(t), vn(d) oder vn(de) aufgelöst wird.
	</p>
</div>
