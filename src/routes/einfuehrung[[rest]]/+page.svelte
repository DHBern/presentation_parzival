<script>
	import { popup } from '@skeletonlabs/skeleton';

	/** @type {import('@skeletonlabs/skeleton').PopupSettings}*/
	const popupClick = {
		event: 'focus-click',
		target: 'popupClick',
		placement: 'top'
	};

	/** @type {HTMLSpanElement} */
	let popupContent = $state();
</script>

<div class="card m-8 p-4 variant-filled-primary" data-popup="popupClick">
	<span bind:this={popupContent}>content</span>
	<div class="arrow variant-filled-primary"></div>
</div>
<div class="container mx-auto typography">
	<h1 class="h1 mb-4">
		Wolfram von Eschenbach, ›Parzival‹.<br />Eine überlieferungskritische Ausgabe in digitaler Form
	</h1>
	<h2>Voraussetzungen</h2>

	<p>
		Wolfram von Eschenbach hat mit seinem ›Parzival‹ einen der bedeutendsten Erzähltexte des
		europäischen Mittelalters geschaffen. Der zwischen 1200 und 1210 entstandene Versroman verbindet
		den keltischen Artusstoff mit religiöser Gralsthematik. Als zentral erscheint dabei die Frage,
		wie eine von Widersprüchen und Gegensätzen zerrissene Welt wieder heil wird.
		<br />

		Wolfram verleiht dieser Frage in der fiktiven Gestalt seines ›Parzival‹ ein überzeitliches
		Gepräge, und er hat damit eine intensive Rezeption hervorgerufen. Allein die heute bekannten
		Zahlen der mittelalterlichen ›Parzival‹-Überlieferung sprechen für sich: Man kennt 16
		(annähernd) vollständig erhaltene Handschriften, über 70 Fragmente sowie einen Druck vom Jahr
		1477. Schätzungen der im Mittelalter kursierenden Überlieferungsträger belaufen sich auf bis zu
		1000 Textzeugen. <br />

		Seit im 18. Jahrhundert das Interesse an den volkssprachigen Dichtungen des Mittelalters
		wiedererwacht ist, beschäftigt sich auch die moderne Literaturwissenschaft mit Wolframs
		Gralsroman. Die dabei erarbeiteten Deutungen sind ebenso vielfältig wie kontrovers. Doch
		orientiert sich die Exegese an einer Ausgabe, die – zu ihrer Entstehungszeit ein editorisches
		Meisterwerk – gegenwärtigen Ansprüchen nicht mehr genügen kann. Karl Lachmanns
		›Parzival‹-Edition von 1833 bildete für Generationen von Germanisten die maßgebliche Basis der
		Auseinandersetzung und fand Neubearbeitungen bis ins 21. Jahrhundert. Dass sie bis heute
		unersetzt blieb, liegt an der Fülle des handschriftlichen Materials und am Umfang des nahezu
		25.000 Verse umfassenden ›Parzival‹-Romans. Gleichwohl ist man sich in der jüngeren Forschung
		einig über die Notwendigkeit einer Neuausgabe, und entsprechend unbefriedigend gestaltet sich
		die Arbeit mit einem gemeinhin als revisionsbedürftig erkannten Text. <br />

		Kritik findet Lachmanns Methode der Textherstellung, die ein überlieferungsgeschichtlich nicht
		einholbares Autororiginal zu rekonstruieren sucht. Kritik finden zahlreiche editorische
		Entscheidungen Lachmanns, so namentlich jene, im Handschriftenapparat die
		Überlieferungsverhältnisse nicht genau zu bezeichnen, sondern durch Gruppensiglen zu
		verschleiern. Kritik findet schließlich die Tatsache, dass die von Lachmann abhängigen
		Neuausgaben die Vielzahl der inzwischen bekannt gewordenen Überlieferungsträger nicht
		hinreichend berücksichtigen. Aus diesen Defiziten ist das Desiderat einer neuen kritischen
		Textausgabe erwachsen, die auf der Grundlage der gesamten heute bekannten Überlieferung basiert
		(<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>J. Bumke <span class="hidden">
				Vgl. Joachim Bumke, Wolfram von Eschenbach, (8., völlig neu bearbeitete Auflage) Stuttgart/
				Weimar 2004 (Sammlung Metzler 36), S. 254.
			</span>
		</button>
		).
	</p>

	<h2>Methodischer Kontext</h2>
	<p>
		Dieses Desiderat findet sich auf zentrale Probleme in der philologischen Theoriediskussion der
		germanistischen Mediävistik verwiesen. Zu nennen wären Phänomene wie das Verhältnis von
		Aufführung und Schrift, die vielfach beobachtbare Varianz mittelalterlicher Texte, Konzepte der
		Autorschaft und Überlieferungsgeschichte sowie Fragen einer adäquaten Textherstellung und
		Textpräsentation. Sehr stark vereinfacht ließe sich sagen, daß die Fachdebatte um zwei
		Standpunkte kreist, die man schlagwortartig mit den Begriffen
		<i>New Philology</i> und <i>New Phylogeny</i> benennen könnte (bei letzterem handelt es sich um
		einen hier in Anlehnung an die Bezeichnung
		<i>New Philology</i> geprägten Neologismus): <br />

		Die
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			><i>New Philology</i>
			<span class="hidden">
				Vgl. zur Diskussion in der Altgermanistik z.B. Karl Stackmann, Neue Philologie?, (Nachdruck
				aus: Modernes Mittelalter. Neue Bilder einer populären Epoche, hrsg. v. Joachim Heinzle,
				Frankfurt am Main/ Leipzig 1994, S. 398-427) in: Karl Stackmann, Philologie und
				Lexikographie. Kleine Schriften II, hrsg. v. Jens Haustein, Göttingen 1998, S. 20-41; ders.,
				Autor - Überlieferung - Editor, in: Das Mittelalter und die Germanisten. Zur neueren
				Methodengeschichte der Germanischen Philologie. Freiburger Colloquium 1997, hrsg. v. Eckart
				Conrad Lutz, Freiburg i. Ü. 1998 (Scrinium Friburgense 11), S. 11-32, bes. S. 24-32.
			</span>
		</button>
		betont die handschriftliche Vielfalt und die daraus resultierende Unfestigkeit der mittelalterlichen
		Texte. Sie tendiert dazu, die Hierarchie der einzelnen Überlieferungszeugen zugunsten eines prinzipiell
		variablen, unfesten Status der mittelalterlichen Handschriftenkultur preiszugeben.<br />

		Die <i>New Phylogeny</i> hält demgegenüber an handschriftlichen Bezügen und Gruppierungen als
		der Basis überlieferungskritischer Untersuchungen fest. Der aus der Evolutionsbiologie stammende
		Begriff <i>Phylogeny</i> (deutsch: ‚Phylogenese‘) bezeichnet die stammesgeschichtliche
		Verwandtschaft der Arten und wird im angelsächsischen Raum derzeit auf Fragen handschriftlicher
		Beziehungen angewandt, so etwa in der
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>Chaucer-Forschung <span class="hidden">
				Vgl. Adrian C. Barbrook/ Christopher J. Howe/ Norman Blake/ Peter Robinson, The phylogeny of
				’The Canterbury Tales’, in: Nature, vol. 394, issue 6696, 27-8-1998, S. 839; Christopher J.
				Howe/ Adrian C. Barbrook/ Matthew Spencer/ Peter Robinson/ Barbara Bordalejo/ Linne R.
				Mooney, Manuscript Evolution, in: Endeavour 25/3 (2001), S. 121–126.
			</span>
		</button>
		.<br />

		Eine kritische Neuausgabe des ›Parzival‹ muss der zu verarbeitenden Lesartenfülle und den nicht
		unbeträchtlichen Problemen der Textherstellung vor dem methodischen Hintergrund der Polarität
		von
		<i>New Philology</i>
		und <i>New Phylogeny</i> begegnen. Damit erscheint eine in der ›Parzival‹-Philologie der
		sechziger Jahre erhobene Forderung aktueller denn je, nämlich „vor der Klärung der
		Hss.-Verzweigung das gesamte Material, das zur textkritischen Auswertung gesammelt wurde, [...]
		zu publizieren“ (
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>E. Nellmann <span class="hidden">
				Eberhard Nellmann, Zur handschriftlichen Überlieferung des Parzival, in: Kolloquium über
				Probleme altgermanistischer Editionen. Marbach am Neckar, 26. und 27. April 1966. Referate
				und Diskussionsbeiträge, hrsg. v. Hugo Kuhn/ Karl Stackmann/ Dieter Wuttke, Wiesbaden 1968
				(Deutsche Forschungsgemeinschaft. Forschungsberichte 13), S. 13-21, hier S. 20.
			</span>
		</button>
		).<br />

		Der Gedanke mag, als er 1968 vorgebracht worden ist, utopisch erschienen sein. Er lässt sich
		jedoch heute mit Hilfe digitaler Methoden umsetzen. Eine überlieferungskritische Ausgabe in
		digitaler Form ist die unverzichtbare Voraussetzung für jede Neuedition des ›Parzival‹.
	</p>

	<h2>Das Parzival-Projekt</h2>

	<p>
		Im Rahmen eines vom Schweizerischen Nationalfonds und phasenweise von der Deutschen
		Forschungsgemeinschaft geförderten Projekts erarbeitet ein von Prof. Dr. Michael Stolz
		geleitetes Forschungsteam an der Universität Bern eine solche digitale Ausgabe. Dabei wird eine
		Edition nach Fassungen erstellt, die auf Volltranskriptionen aller Textzeugen beruht und in
		Anlehnung an den von Joachim Bumke geprägten
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>Fassungsbegriff <span class="hidden">
				Ein Ansatz, der in der Erforschung mittelhochdeutscher Epik zunehmend favorisiert wird und
				die Annahme eines einzelnen Autororiginals verdrängt. Vgl. Joachim Bumke, Der unfeste Text.
				Überlegungen zur Überlieferungsgeschichte und Textkritik der höfischen Epik im 13.
				Jahrhundert, in: ’Aufführung’ und ’Schrift’ in Mittelalter und Früher Neuzeit, hrsg. v.
				Jan-Dirk Müller, Stuttgart/ Weimar 1996 (Germanistische Symposien. Berichtsbände 17), S.
				118–129; ders., Die vier Fassungen der Nibelungenklage’. Untersuchungen zur
				Überlieferungsgeschichte und Textkritik der höfischen Epik im 13. Jahrhundert, Berlin/ New
				York 1996 (Quellen und Forschungen zur Literatur- und Kulturgeschichte 8 [242]).
			</span>
		</button>
		vier Textfassungen dokumentiert: *D (basierend u.a. auf Handschrift D), *m (basierend u.a. auf den
		Handschriften mno), *G (basierend u.a. auf den Handschriften GI LM OQR Z), *T (basierend u.a. auf
		den Textzeugen TUVW).<br />
		Durch die Neuedition wird – im Sinne der <i>New Philology</i> – die Unfestigkeit des Textes in
		ihrer überlieferungsgeschichtlichen Vielfalt sichtbar. Gleichzeitig ermöglichen digitale
		Speicherverfahren auch – den Forderungen der <i>New Phylogeny</i> entsprechend – einen neuen
		Blick auf handschriftliche Beziehungen. Hierbei kann auf stemmatologische Vorgehensweisen
		zurückgegriffen werden, die der niederländische Romanist
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>Anthonij Dees <span class="hidden">
				Vgl. Anthonij Dees, Sur une constellation de quatre manuscrits, in: Mélanges de linguistique
				et de littérature offerts à Lein Geschiere par ses amis, collègues et élèves, hrsg. v. A.
				Dees/ A.Kibédy Varga/ R.E.V. Stuip, Amsterdam 1975, S. 1-9; ders., Considérations théoriques
				sur la tradition manuscrite du ’Lai de l’Ombre’, in: Neophilologus 60 (1976), S. 481-504.
				Ferner die übersichtliche Zusammenfassung in der leider nur schwer zugänglichen Dissertation
				von Margot van Mulken, The Manuscript Tradition of the Perceval of Chrétien de Troyes. A
				stemmatological and dialectical approach, Diss. Vrije Universiteit Amsterdam, Faculteit der
				Letteren 1993, S. 45-61.
			</span>
		</button>
		entwickelt hat.<br />

		Anstelle von historischen Genealogien handschriftlicher Stammbäume geht Dees von Verkettungen in
		sogenannten ‚unrooted trees‘ aus, die keinen Aufhängungspunkt haben und auf die von einem
		Archetypus ausgehenden Verzweigungen verzichten. Dieses Abstraktionsniveau macht das Aufzeigen
		von Beziehungen zwischen handschriftlichen Varianten möglich, ohne dass daraus schon zwingend
		genealogische Abhängigkeiten erschlossen werden. Nach demselben Prinzip verfahren
		phylogenetische Analysen der Evolutionsbiologie, die aufgrund bestimmter Eigenschaften einzelner
		Arten deren Beziehungen und Gruppierungen ermitteln, noch ehe daraus Schlussfolgerungen über die
		Stammesgeschichte selbst gezogen werden. In Zusammenarbeit mit Biologen und Philologen an den
		Universitäten Cambridge (England) und Helsinki (Finnland) konnten solche ‚unrooted trees‘ zu
		verschiedenen Abschnitten des ›Parzival‹-Romans erstellt werden. Vgl. dazu den
		<a href="/Stolz_Wolfr12_SD.pdf" target="_blank">Beitrag von Michael Stolz</a> in: Wolfram-Studien
		23 (2014), bes. S. 459–465.
	</p>

	<h2>Editionsproben</h2>

	<p>
		Welche Möglichkeiten die synoptische Darstellung von Fassungen und Überlieferungsträgern am
		Bildschirm bietet, zeigt die Abteilung Editionsproben auf dieser Website. Dort werden auch die
		Verfahren der
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>Fassungsedition <span class="hidden">
				Die Beispiele zeigen ein Editionskonzept nach den vier Fassungen *D *G *m und *T auf: Ein
				Mausklick auf die links neben einer Versangabe befindliche Fassungssigle (z.B. *D) bringt
				den entsprechenden Vers der jeweils folgenden Fassung (z.B. *G) in der obersten Zeile zur
				Anzeige. Auf diese Weise kann durch fortgesetztes Anklicken der jeweils selben Versposition
				rasch eine Konkordanz hergestellt werden. Die unter den Fassungstexten befindlichen Fenster
				enthalten einen zweistöckigen Apparat. Die erste Etage ("Apparat 1") dokumentiert
				Gliederungseinrichtungen der Handschriften, wie etwa Initialen, Überschriften und
				Capitulumzeichen. Die zweite Etage ("Apparat 2") verzeichnet aussagerelevante Varianten in
				der Textgestalt, etwa Wortersetzungen, Wortumstellungen, Änderungen bei morphologischen
				Kompositionsteilen wie Präfixen und auch Wechsel der Flexionsklasse (Varianten, die nicht
				aussagerelevant sind, können über die Einzeltranskriptionen erschlossen werden). In den
				einzelnen Fassungstexten kann Apparat 1 durch einen Mausklick auf die Abschnittangabe (z.B.
				den 'Dreißiger' 184) angesprungen werden; Apparat 2 wird mit einem Mausklick auf die daneben
				stehende Versangabe (z.B. 01) erreicht. Der Link fehlt in den angegebenen Positionen jeweils
				dann, wenn der betroffene Vers keine Varianten des einen oder anderen Typs aufweist. Über
				die Handschriftensiglen der Apparate kann eine Volltranskription mit Digitalfaksimiles der
				einzelnen Manuskripte angesteuert werden. Die Ansicht öffnet sich in einem neuen Fenster,
				das verschiebbar und in seiner Größe beliebig veränderbar ist. Dies ermöglicht einen
				direkten Vergleich zwischen den Transkriptionen und den Fassungstexten. Die Transkriptionen
				folgen den unter "Editionsproben" angegebenen Konventionen. Die Transkriptionen der
				Einzelhandschriften können zudem auch über die blauen Handschriftensiglen in der oberen
				Menüleiste über den Fassungstexten angesprochen werden. Mit dem Button "3 Fassungen" kann
				der Fassungstext von *T ausgeblendet werden, um eine bessere Darstellung auf Monitoren mit
				geringerer Breite zu gewährleisten.
			</span>
		</button>
		und das Modell einer
		<button
			class="anchor"
			use:popup={popupClick}
			onfocus={(e) => (popupContent.innerHTML = e.target.querySelector('.hidden').innerHTML)}
			>Eintextedition <span class="hidden">
				Neben der synoptischen Mehrtextedition wird auch eine Eintextedition (Lesetext) angeboten,
				in welcher die wichtigsten editorischen Informationen gebündelt präsentiert werden. Der
				kritische Text ist hier nach Fassung *D auf der Grundlage des St. Galler Codex 857
				eingerichtet. Rechts daneben werden in verkleinertem Schriftgrad die Varianten der
				Fassungstexte *G und *T (nach der jeweiligen Leithandschrift) in normalisierter Form mit der
				jeweiligen Fassungssigle angegeben, wobei auch Binnenvarianten ausgewählter Handschriften
				berücksichtigt werden. Die Varianten der Fassung *m (die Fassung *D nahe steht) sind dagegen
				in der dritten Apparatetage untergebracht: Die erste dieser drei Apparatetagen listet die
				Auswahl der Textzeugen auf, die bei der Angabe der Fassungsvarianten mit berücksichtigt
				werden. Es sind dies neben den Leithandschriften D, m, G und T weitere vollständige
				Handschriften und gegebenenfalls Fragmente, die aus textgeschichtlicher Perspektive als
				besonders wichtig erachtet werden. Die zweite Apparatetage beinhaltet (ähnlich wie „Apparat
				1“ in der synoptischen Edition) Angaben zur materiellen Gestalt der ausgewählten Textzeugen;
				aufgeführt sind Initialen, Majuskeln sowie gegebenenfalls Überschriften und Illustrationen.
				Die dritte Apparatetage dokumentiert Abweichungen der Leithandschrift D gegenüber dem
				konstituierten Text *D und verzeichnet die Varianten der Fassung *m. Auf semantisch wichtige
				Fassungsunterschiede der Fassung *m macht gegebenenfalls ein auf diese Apparatetage
				verweisendes Pfeilsymbol in der Spalte der Fassungsvarianten (neben dem *D-Text) aufmerksam.
				In seltenen Fällen wird das auf diesen Apparat verweisende Pfeilsymbol auch für Varianten
				der Fassungen *G und *T verwendet, falls deren Wortlaut aus Platzgründen nicht neben dem
				Lesetext untergebracht werden kann. Ausführlichere Erläuterungen zur Eintextedition
				enthalten die Beiträge: Michael Stolz: Von den Fassungen zur Eintextedition. Eine neue
				Leseausgabe von Wolframs ›Parzival‹, in: Überlieferungsgeschichte transdisziplinär. Neue
				Perspektivenauf ein germanistisches Forschungsparadigma, in Verbindung mit Horst Brunner u.
				Freimut Löser hg. von Dorothea Klein, Wiesbaden 2016 (Wissensliteratur im Mittelalter 52),
				S. 353–388. Brüggen, Elke u. Michael Stolz: Fassungen, Übersetzung und Kommentar. Profile
				einer neuen Ausgabe von Wolframs ›Parzival‹ – erscheint in: Walther von der Vogelweide.
				Düsseldorfer Kolloquium 2018, in Verbindung mit Franz-Josef Holznagel u. Mathias Herweg hg.
				von Ricarda Bauschke-Hartung, Berlin 2020 (Wolfram-Studien 26), S. 471–493 (im Druck)
			</span>
		</button>
		(basierend auf&nbsp;<a href="/hsverz" target="_self">Codex 857</a> der Stiftsbibliothek St.
		Gallen aus der Mitte des 13. Jahrhunderts, Hs. D) erläutert.<br />

		Zweifellos kann in einer Digitaledition die von der <i>New Philology</i> postulierte Varianz
		angemessener dokumentiert werden als in konventionellen Textausgaben. Die kritischen Apparate
		traditionellen Zuschnitts teilen die Lesarten zumeist nur punktuell mit, wobei die Varianten
		Wort für Wort wiedergegeben werden. Am Bildschirm hingegen wird die überlieferungsgeschichtliche
		Vielfalt nachvollziehbar. Der zweite wichtige Vorteil der Digitaledition liegt jedoch gerade in
		dem von der <i>New Phylogeny</i> geforderten Aufweis handschriftlicher Gruppierungen.
		Computerprogramme beschleunigen die Analyseverfahren und erleichtern eine flexible Handhabe
		handschriftlicher Zuordungen. Sie erlauben die zügige Revision philologischer Urteile über
		Leithandschriften und stemmatologische Relationen. <br />

		Somit ermöglicht die Digitaledition eine Synthese von zunächst gegensätzlich erscheinenden
		philologischen Standpunkten. In der Kombination von Ansätzen der <i>New Philology</i> und der
		<i>New Phylogeny</i>
		bietet sie die unabdingbare Voraussetzung für jede kritische Neuausgabe des ›Parzival‹. Indem sie
		stemmatologische Methoden mit überlieferungs- und mediengeschichtlichen Zugängen verbindet, stellt
		sie darüber hinaus eine neue Editionsform eigener Prägung und eigenen Rechts dar. Die Benutzerinnen
		und Benutzer werden dabei bis zu einem gewissen Grad an der editorischen Arbeit beteiligt und erhalten
		Freiräume im Zugriff auf unterschiedliche Textversionen und deren handschriftliches Erscheinungsbild.
		Die auf diese Weise bereitgestellten Überlieferungszeugnisse dürften für Literar- und Sprachhistoriker
		gleichermaßen von Interesse sein. <br />

		Die Nutzung des digitalen Mediums fügt sich somit in einen jahrhundertealten
		Überlieferungsprozess ein - vom Zeitalter nach Gutenberg gelangen die Benutzerinnen und Benutzer
		in die Ära vor Gutenberg. Hier zeigt sich die kulturwissenschaftliche Relevanz der digitalen
		›Parzival‹-Ausgabe: Sie steht im Kontext aktueller Ausrichtungen der historischen
		Wissenschaften, die sich vermehrt der überlieferungsgeschichtlichen Medialität sowie
		diskursanalytischen und anthropologischen Fragestellungen zuwenden. Nach der an historischen
		Großereignissen orientierten politischen Geschichte und der über die menschliche Arbeit
		definierten Sozialgeschichte rücken Aspekte der Vermittlung, Tradierung und Speicherung
		historischer Wissensbestände in den Vordergrund. An die Stelle des <i>homo laborans</i> tritt
		der
		<i>homo tradens</i>
		der historischen Anthropologie. <br />
	</p>
</div>
