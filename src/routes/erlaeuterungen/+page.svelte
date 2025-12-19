<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';
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
	<div class="mb-6">
		<p>
			Paratexte wie Notizen, Marginalien, Kustoden und Reklamanten werden kursiviert wiedergegeben.
		</p>

		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/8/1"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
				>D 8.1</a
			>
			<div class="mt-2">
				<span class="content"
					><span class="tei-name"
						><span data-ref="regp:p0094"
							><span class="tei-seg9 initial Farbe: blau">G</span>Ahmvͦreth</span
						></span
					>
					ſprach ave ſan. <span class="tei-note3 marginalia">Gahmuret</span></span
				>
			</div>
		</div>
	</div>
	<p>Doppelt auftretende Verse erhalten die Ergänzung -r.</p>
	<p>
		Die Ergänzung -a kennzeichnet Verse, die im Zusammenhang mit Kürzungen abweichen. Spezialfall R:
		-a wird verwendet für Verse, die aufgrund der für Hs. R spezifischen Versdoppelungen abweichen.
	</p>
	<p>
		Die Ergänzung -k kennzeichnet kontrahierte Verse, welche eine Mischung aus mehreren Versen
		darstellen.
	</p>
	<div class="mb-6">
		Verse, die Teil einer Versumstellung sind, werden am Versende mit einem vertikalen Doppelpfeil
		(↕) markiert.
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/g/460/25?"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				G 460.25
			</a>
			<div class="mt-2">
				<div class="tei-l line" id="g_460.25">
					<span class="verse" data-verse="460.25"> </span>
					<span class="content">
						<span class="tei-milestone1 versechange"></span>
						Ame d
						<span class="tei-choice1">(e)</span>m ſaltir laſ er im gar.
					</span>
				</div>
			</div>
		</div>
	</div>
	<p>
		Zeilenumbrüche (ausserhalb der Konvention von abgesetzten Versen) werden mit einem senkrechten
		Strich (|) markiert. Worttrennungen mit Trennungszeichen werden mit =| wiedergegeben.
	</p>
	<div class="mb-6">
		<p>Initialen: rot, größere Schrift.</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/5/29?"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
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
	<div class="mb-6">
		<p>Prachtinitialen: rot, größere Schrift, Goldhintergrund.</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/1/01-01?"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				D 1.1
			</a>
			<div class="mt-2">
				<span class="tei-content">
					<span class="content">
						<span class="tei-seg8 glory-initial">I</span>ST zwiuel h<span class="tei-choice1"
							>(er)</span
						>zen nahgebur
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>
			Nicht ausgeführte Initialen: rot, kleinere Schrift. Hat der Schreiber den Initialbuchstaben
			vorgeschrieben, wird dieser eingesetzt. In allen anderen Fällen steht der Stellvertreter <span
				class="tei-seg1 not-executed">x</span
			>.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/fr31/446/1"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				Fr. 31 446.1
			</a>

			<div class="mt-2">
				<div class="tei-l" id="fr31_446.01">
					<span class="verse" data-verse="446.01">446.1<sup></sup></span>
					<span class="content">
						<span class="tei-seg1 not-executed">x</span>werſ rvͦchet hoeren dem tvͦn ich kvnt</span
					>
				</div>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>
			Auszeichnungen in den Handschriften (Rubrizierungen u. a.) werden orangefarbig wiedergegeben.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/u/731/13"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
				>U 731.13</a
			>
			<div class="mt-2">
				<span class="content"
					>Der kuͦnec <span class="tei-name"
						><span data-ref="regp:p0107"><span class="tei-hi1 red rot">G</span>ramoflanz</span
						></span
					> in bot</span
				>
			</div>
		</div>
	</div>

	<p>
		Versalien und Majuskeln werden in Fettdruck wiedergegeben (z. B.: <span
			class="tei-seg7 majuscule">D</span
		>iz).
	</p>

	<p>Überschriften: rotfarbig (z. B.: <span class="tei-hi1 red rot">Her parcifal</span>).</p>

	<div class="mb-6">
		<p>
			Vom Schreiber ausgeführte Korrekturen: Das korrigierte Wort weist hellgraue Farbe auf (für
			unlesbare Buchstaben steht *), das Korrekturresultat wird in grüner Farbe angezeigt.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/747/18?"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
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
	<div class="mb-6">
		<p>Vom Schreiber eingefügte Nachträge werden in grüner Farbe dargestellt.</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/u/731/12"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				U 731.12
			</a>
			<div class="mt-2">
				<span class="content"
					><span class="tei-add1 sr">Der wuͦnſchte die nacht vor den dac</span></span
				>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>
			Von einem späteren Korrektor ausgeführte Korrekturen: Das korrigierte Wort weist hellgraue
			Farbe auf (für unlesbare Buchstaben steht *), das Korrekturresultat wird in türkiser Farbe
			angezeigt.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/53/18"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
				>D 53.18</a
			>
			<div class="mt-2">
				<span class="content"
					>alſ al die boͮme trvͦgent <span class="tei-subst1 subst_ls"
						><span class="tei-del2 deleted">got</span><span class="tei-add2 added">golt</span></span
					>.</span
				>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>Von einem späteren Korrektor ausgeführte Nachträge werden in türkiser Farbe dargestellt.</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<div class="mt-2">
				<span class="tei-content">
					<span class="content">
						<span class="subst_ls">vohet hie sine kintheit an</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>
			Wenn die Korrekturen durch Rasur erfolgen, stehen die korrigierten Buchstaben und Wörter auf
			dunkelgrauem Hintergrund.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/v/731/12"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
				>V 731.12</a
			>
			<div class="mt-2">
				<span class="content"
					>Der wúnſchet
					<span class="tei-subst1 subst_ls">
						<span class="tei-del2 deleted">*</span>
						<span class="tei-add2 added">
							<span class="tei-hi3 rasure rasur">der</span>
						</span>
					</span> naht fúr den tag
				</span>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>
			Ersatzlos getilgte Wörter werden in grauer Farbe und durchgestrichen wiedergegeben (z. B.: <span
				class="del_sr">hie</span
			>). Die Zeichenfolge
			<span class="tei-subst1 subst_ls">
				<span class="tei-del2 deleted">+</span>
				<span class="tei-add2 added">
					<span class="tei-hi3 rasure rasur">
						<span class="tei-gap5 gap">-*-</span>
					</span>
				</span>
			</span>
			steht für ein ersatzlos getilgtes Kreuz, das die Funktion einer Marginalie einnimmt.
		</p>
		<div
			class="relative border rounded-xl p-3 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/v/141/16"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				V 141.16
			</a>
			<div class="mt-2">
				<span class="content">
					<span class="del_sr">hie</span>
					<span class="tei-subst1 subst_ls">
						<span class="tei-del2 deleted">+</span>
						<span class="tei-add2 added">
							<span class="tei-hi3 rasure rasur">
								<span class="tei-gap5 gap">-*-</span>
							</span>
						</span>
					</span>
				</span>
			</div>
		</div>
	</div>
	<p>
		Diakritische Zeichen werden als solche dargestellt. Zirkumflex wird grundsätzlich gemäß der
		Handschrift transkribiert. Ausnahme: Zirkumflex über Diphthongen und mehr als zwei Vokalen in
		Folge wird stets über dem ersten Vokal wiedergegeben.
	</p>
	<div class="mb-6">
		<p>
			Superskripte, die nicht eindeutig identifizierbar sind, werden als übergeschriebene „x“ (z.
			B.: uͯ) wiedergegeben.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/l/8/05"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				L 8.05
			</a>
			<div class="mt-2">
				<span class="content">An guter zuͯht von hoher art</span>
			</div>
		</div>
	</div>
	<div class="mb-6">
		<p>
			Unlesbare Zeichen werden mit : bei einem, mit :: bei zwei und mit ::: bei drei oder mehr
			unleserlichen Buchstaben angegeben. Textverlust aufgrund materieller Beeinträchtigung (z. B.
			Fragmentverlust) wird in jedem Fall mit ::: bezeichnet.
		</p>
		<div
			class="relative border rounded-xl p-4 bg-gray-100 dark:preset-filled-surface-500 shadow-sm mt-6 w-[25em] ml-8"
		>
			<a
				href="https://dhbern.github.io/presentation_parzival/textzeugen/d/3/27"
				target="_blank"
				class="absolute -top-3 left-4 bg-gray-100 dark:preset-filled-surface-500 px-2 text-primary-600 text-sm font-medium rounded-md border border-primary-200 shadow-sm"
			>
				D 3.27
			</a>
			<div class="mt-2">
				<span class="content"
					>da fv̂re e<span class="tei-gap1 gap">:</span>n l<span class="tei-gap2 gap">::</span>g<span
						class="tei-gap4 gap">:::</span
					></span
				>
			</div>
		</div>
	</div>

	<p>
		Wenn der materielle Befund des Textzeugen von der Darstellung der digitalen Reproduktion
		abweicht, wird ersterer in der Transkription berücksichtigt (z. B. in <a
			href="https://dhbern.github.io/presentation_parzival/textzeugen/fr5/446/03?"
			target="_blank">Fragment 5, Bl. 4rc, Vers 446.3</a
		>, wo das Reimwart <i>zal</i> in der Reproduktion auf einem umgeklappten Seitenteil steht und nicht
		sichtbar ist).
	</p>

	<p>
		Die Abkürzungen werden in runden Klammern aufgelöst. Hierbei ist zu beachten, dass vn̅ in jedem
		Textzeugen dem Quantitätsprinzip entsprechend mit vn(t), vn(d) oder vn(de) aufgelöst wird.
	</p>
</div>
