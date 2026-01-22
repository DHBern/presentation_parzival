<script>
	import Popover from '$lib/components/Popover.svelte';

	let lang = 'de';
	const toggleLang = () => (lang = lang === 'de' ? 'en' : 'de');
</script>

<!-- <div class="card m-8 p-4 preset-filled-primary-500" data-popup="popupClick">
	<span bind:this={popupContent}>content</span>
	<div class="arrow preset-filled-primary-500"></div>
</div> -->
<div class="container mx-auto typography">
	<div class="flex items-start justify-end m-2">
		<button
			type="button"
			class="btn btn-icon"
			aria-label={lang === 'de' ? 'Switch to English' : 'Zur deutschen Version'}
			on:click={toggleLang}
		>
			<i class="fa-solid fa-globe"></i>{lang}
		</button>
	</div>
</div>

{#if lang === 'de'}
	<div class="container mx-auto typography">
		<h1 class="h1 mb-4">
			Wolfram von Eschenbach, ›Parzival‹.<br />Eine überlieferungskritische Ausgabe in digitaler
			Form
		</h1>
		<h2>Voraussetzungen</h2>

		<p>
			Wolfram von Eschenbach hat mit seinem ›Parzival‹ einen der bedeutendsten Erzähltexte des
			europäischen Mittelalters geschaffen. Der zwischen 1200 und 1210 entstandene Versroman
			verbindet den keltischen Artusstoff mit religiöser Gralsthematik. Als zentral erscheint dabei
			die Frage, wie eine von Widersprüchen und Gegensätzen zerrissene Welt wieder heil wird.
			<br />

			Wolfram verleiht dieser Frage in der fiktiven Gestalt seines ›Parzival‹ ein überzeitliches
			Gepräge, und er hat damit eine intensive Rezeption hervorgerufen. Allein die heute bekannten
			Zahlen der mittelalterlichen ›Parzival‹-Überlieferung sprechen für sich: Man kennt 16
			(annähernd) vollständig erhaltene Handschriften, über 70 Fragmente sowie einen Druck vom Jahr
			1477. Schätzungen der im Mittelalter kursierenden Überlieferungsträger belaufen sich auf bis
			zu 1000 Textzeugen. <br />

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
			Textausgabe erwachsen, die auf der Grundlage der gesamten heute bekannten Überlieferung
			basiert (<Popover>
				{#snippet trigger()}
					J. Bumke
				{/snippet}
				{#snippet content()}
					<p>
						Vgl. Joachim Bumke, Wolfram von Eschenbach, (8., völlig neu bearbeitete Auflage)
						Stuttgart/ Weimar 2004 (Sammlung Metzler 36), S. 254.
					</p>
				{/snippet}
			</Popover>
			).
		</p>

		<h2>Methodischer Kontext</h2>
		<p>
			Dieses Desiderat findet sich auf zentrale Probleme in der philologischen Theoriediskussion der
			germanistischen Mediävistik verwiesen. Zu nennen wären Phänomene wie das Verhältnis von
			Aufführung und Schrift, die vielfach beobachtbare Varianz mittelalterlicher Texte, Konzepte
			der Autorschaft und Überlieferungsgeschichte sowie Fragen einer adäquaten Textherstellung und
			Textpräsentation. Sehr stark vereinfacht ließe sich sagen, daß die Fachdebatte um zwei
			Standpunkte kreist, die man schlagwortartig mit den Begriffen
			<i>New Philology</i> und <i>New Phylogeny</i> benennen könnte (bei letzterem handelt es sich
			um einen hier in Anlehnung an die Bezeichnung
			<i>New Philology</i> geprägten Neologismus): <br />

			Die
			<Popover>
				{#snippet trigger()}<i>New Philology</i>{/snippet}
				{#snippet content()}
					Vgl. zur Diskussion in der Altgermanistik z.B. Karl Stackmann, Neue Philologie?,
					(Nachdruck aus: Modernes Mittelalter. Neue Bilder einer populären Epoche, hrsg. v. Joachim
					Heinzle, Frankfurt am Main/ Leipzig 1994, S. 398-427) in: Karl Stackmann, Philologie und
					Lexikographie. Kleine Schriften II, hrsg. v. Jens Haustein, Göttingen 1998, S. 20-41;
					ders., Autor - Überlieferung - Editor, in: Das Mittelalter und die Germanisten. Zur
					neueren Methodengeschichte der Germanischen Philologie. Freiburger Colloquium 1997, hrsg.
					v. Eckart Conrad Lutz, Freiburg i. Ü. 1998 (Scrinium Friburgense 11), S. 11-32, bes. S.
					24-32.
				{/snippet}
			</Popover>
			betont die handschriftliche Vielfalt und die daraus resultierende Unfestigkeit der mittelalterlichen
			Texte. Sie tendiert dazu, die Hierarchie der einzelnen Überlieferungszeugen zugunsten eines prinzipiell
			variablen, unfesten Status der mittelalterlichen Handschriftenkultur preiszugeben.<br />

			Die <i>New Phylogeny</i> hält demgegenüber an handschriftlichen Bezügen und Gruppierungen als
			der Basis überlieferungskritischer Untersuchungen fest. Der aus der Evolutionsbiologie
			stammende Begriff <i>Phylogeny</i> (deutsch: ‚Phylogenese‘) bezeichnet die
			stammesgeschichtliche Verwandtschaft der Arten und wird im angelsächsischen Raum derzeit auf
			Fragen handschriftlicher Beziehungen angewandt, so etwa in der
			<Popover>
				{#snippet trigger()}Chaucer-Forschung{/snippet}
				{#snippet content()}
					Vgl. Adrian C. Barbrook/ Christopher J. Howe/ Norman Blake/ Peter Robinson, The phylogeny
					of ’The Canterbury Tales’, in: Nature, vol. 394, issue 6696, 27-8-1998, S. 839;
					Christopher J. Howe/ Adrian C. Barbrook/ Matthew Spencer/ Peter Robinson/ Barbara
					Bordalejo/ Linne R. Mooney, Manuscript Evolution, in: Endeavour 25/3 (2001), S. 121–126.
				{/snippet}
			</Popover>
			.<br />

			Eine kritische Neuausgabe des ›Parzival‹ muss der zu verarbeitenden Lesartenfülle und den
			nicht unbeträchtlichen Problemen der Textherstellung vor dem methodischen Hintergrund der
			Polarität von
			<i>New Philology</i>
			und <i>New Phylogeny</i> begegnen. Damit erscheint eine in der ›Parzival‹-Philologie der
			sechziger Jahre erhobene Forderung aktueller denn je, nämlich „vor der Klärung der
			Hss.-Verzweigung das gesamte Material, das zur textkritischen Auswertung gesammelt wurde,
			[...] zu publizieren“ (
			<Popover>
				{#snippet trigger()}E. Nellmann
				{/snippet}
				{#snippet content()}
					Eberhard Nellmann, Zur handschriftlichen Überlieferung des Parzival, in: Kolloquium über
					Probleme altgermanistischer Editionen. Marbach am Neckar, 26. und 27. April 1966. Referate
					und Diskussionsbeiträge, hrsg. v. Hugo Kuhn/ Karl Stackmann/ Dieter Wuttke, Wiesbaden 1968
					(Deutsche Forschungsgemeinschaft. Forschungsberichte 13), S. 13-21, hier S. 20.
				{/snippet}
			</Popover>
			).<br />

			Der Gedanke mag, als er 1968 vorgebracht worden ist, utopisch erschienen sein. Er lässt sich
			jedoch heute mit Hilfe digitaler Methoden umsetzen. Eine überlieferungskritische Ausgabe in
			digitaler Form ist die unverzichtbare Voraussetzung für jede Neuedition des ›Parzival‹.
		</p>

		<h2>Das Parzival-Projekt</h2>

		<p>
			Im Rahmen eines vom Schweizerischen Nationalfonds und phasenweise von der Deutschen
			Forschungsgemeinschaft geförderten Projekts erarbeitet ein von Prof. Dr. Michael Stolz
			geleitetes Forschungsteam an der Universität Bern eine solche digitale Ausgabe. Dabei wird
			eine Edition nach Fassungen erstellt, die auf Volltranskriptionen aller Textzeugen beruht und
			in Anlehnung an den von Joachim Bumke geprägten
			<Popover>
				{#snippet trigger()}Fassungsbegriff
				{/snippet}
				{#snippet content()}
					Ein Ansatz, der in der Erforschung mittelhochdeutscher Epik zunehmend favorisiert wird und
					die Annahme eines einzelnen Autororiginals verdrängt. Vgl. Joachim Bumke, Der unfeste
					Text. Überlegungen zur Überlieferungsgeschichte und Textkritik der höfischen Epik im 13.
					Jahrhundert, in: ’Aufführung’ und ’Schrift’ in Mittelalter und Früher Neuzeit, hrsg. v.
					Jan-Dirk Müller, Stuttgart/ Weimar 1996 (Germanistische Symposien. Berichtsbände 17), S.
					118–129; ders., Die vier Fassungen der Nibelungenklage’. Untersuchungen zur
					Überlieferungsgeschichte und Textkritik der höfischen Epik im 13. Jahrhundert, Berlin/ New
					York 1996 (Quellen und Forschungen zur Literatur- und Kulturgeschichte 8 [242]).
				{/snippet}
			</Popover>
			vier Textfassungen dokumentiert: *D (basierend u.a. auf Handschrift D), *m (basierend u.a. auf den
			Handschriften mno), *G (basierend u.a. auf den Handschriften GI LM OQR Z), *T (basierend u.a. auf
			den Textzeugen TUVW).<br />
			Durch die Neuedition wird – im Sinne der <i>New Philology</i> – die Unfestigkeit des Textes in
			ihrer überlieferungsgeschichtlichen Vielfalt sichtbar. Gleichzeitig ermöglichen digitale
			Speicherverfahren auch – den Forderungen der <i>New Phylogeny</i> entsprechend – einen neuen
			Blick auf handschriftliche Beziehungen. Hierbei kann auf stemmatologische Vorgehensweisen
			zurückgegriffen werden, die der niederländische Romanist
			<Popover>
				{#snippet trigger()}Anthonij Dees
				{/snippet}
				{#snippet content()}
					Vgl. Anthonij Dees, Sur une constellation de quatre manuscrits, in: Mélanges de
					linguistique et de littérature offerts à Lein Geschiere par ses amis, collègues et élèves,
					hrsg. v. A. Dees/ A.Kibédy Varga/ R.E.V. Stuip, Amsterdam 1975, S. 1-9; ders.,
					Considérations théoriques sur la tradition manuscrite du ’Lai de l’Ombre’, in:
					Neophilologus 60 (1976), S. 481-504. Ferner die übersichtliche Zusammenfassung in der
					leider nur schwer zugänglichen Dissertation von Margot van Mulken, The Manuscript
					Tradition of the Perceval of Chrétien de Troyes. A stemmatological and dialectical
					approach, Diss. Vrije Universiteit Amsterdam, Faculteit der Letteren 1993, S. 45-61.
				{/snippet}
			</Popover>
			entwickelt hat.<br />

			Anstelle von historischen Genealogien handschriftlicher Stammbäume geht Dees von Verkettungen
			in sogenannten ‚unrooted trees‘ aus, die keinen Aufhängungspunkt haben und auf die von einem
			Archetypus ausgehenden Verzweigungen verzichten. Dieses Abstraktionsniveau macht das Aufzeigen
			von Beziehungen zwischen handschriftlichen Varianten möglich, ohne dass daraus schon zwingend
			genealogische Abhängigkeiten erschlossen werden. Nach demselben Prinzip verfahren
			phylogenetische Analysen der Evolutionsbiologie, die aufgrund bestimmter Eigenschaften
			einzelner Arten deren Beziehungen und Gruppierungen ermitteln, noch ehe daraus
			Schlussfolgerungen über die Stammesgeschichte selbst gezogen werden. In Zusammenarbeit mit
			Biologen und Philologen an den Universitäten Cambridge (England) und Helsinki (Finnland)
			konnten solche ‚unrooted trees‘ zu verschiedenen Abschnitten des ›Parzival‹-Romans erstellt
			werden. Vgl. dazu den
			<a href="/Stolz_Wolfr12_SD.pdf" target="_blank">Beitrag von Michael Stolz</a> in: Wolfram-Studien
			23 (2014), bes. S. 459–465.
		</p>

		<h2>Digitale Edition</h2>

		<p>
			Welche Möglichkeiten die synoptische Darstellung von Fassungen und Überlieferungsträgern am
			Bildschirm bietet, zeigt die digitale Edition. <br />

			Zweifellos kann in einer Digitaledition die von der <i>New Philology</i> postulierte Varianz
			angemessener dokumentiert werden als in konventionellen Textausgaben. Die kritischen Apparate
			traditionellen Zuschnitts teilen die Lesarten zumeist nur punktuell mit, wobei die Varianten
			Wort für Wort wiedergegeben werden. Am Bildschirm hingegen wird die
			überlieferungsgeschichtliche Vielfalt nachvollziehbar. Der zweite wichtige Vorteil der
			Digitaledition liegt jedoch gerade in dem von der <i>New Phylogeny</i> geforderten Aufweis
			handschriftlicher Gruppierungen. Computerprogramme beschleunigen die Analyseverfahren und
			erleichtern eine flexible Handhabe handschriftlicher Zuordungen. Sie erlauben die zügige
			Revision philologischer Urteile über Leithandschriften und stemmatologische Relationen. <br />

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
			Überlieferungsprozess ein - vom Zeitalter nach Gutenberg gelangen die Benutzerinnen und
			Benutzer in die Ära vor Gutenberg. Hier zeigt sich die kulturwissenschaftliche Relevanz der
			digitalen ›Parzival‹-Ausgabe: Sie steht im Kontext aktueller Ausrichtungen der historischen
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
{:else}
	<div class="container mx-auto typography">
		<h1>Wolfram von Eschenbach, ›Parzival‹.<br />A New Critical Electronic Edition</h1>
		<h2>Introductory</h2>

		<p>
			Wolfram von Eschenbach’s <i>Parzival</i> ranks as one of the most significant narrative works
			to emerge from medieval Europe. Composed between 1200 and 1210, it combines the Arthurian
			material of Celtic origin with the religious subject-matter of the Holy Grail. The central
			question in the work is how a world torn apart by contradictions and conflicts can again be
			rendered whole.
			<br />
			Within the fictitious garb of the <i>Parzival</i>-romance Wolfram confers upon this question a
			shape that transcends time, which has given rise to intense interest on the part of listeners
			and readers. The sheer number of medieval manuscripts preserving the poem today speaks for
			itself (16 medieval manuscripts, more than 70 fragments, and a print dating from 1477). <br />
			Ever since the late eighteenth-century revival of interest in the vernacular poetry of the Middle
			Ages, modern literary scholarship has concerned itself with Wolfram’s Grail romance. The interpretations
			that have been arrived at are as varied as they are controversial. Exegesis has, however, been based
			upon an edition which, although a masterpiece of its time, can no longer meet today’s expectations.
			Karl Lachmann’s <i>Parzival</i> edition of 1833 formed the standard basis for interpretation for
			generations of Germanists, but recent scholarship is agreed upon the necessity for a new edition,
			and has become increasingly discontented with working with a text that is generally acknowledged
			to be in need of revision.
		</p>

		<h2>Methodological context</h2>

		<p>
			The challenge presented to the editor of <i>Parzival</i>
			also relates to central problems in the theory of medieval philology today. Worthy of note in this
			context are phenomena such as the relationship between oral performance and its literary codification,
			the ensuing variability of medieval texts, as well as concepts of authorship and transmission, and
			their effects upon the way in which a text is presented. <br />
			To put it in its simplest terms, scholarly debate hinges upon two pivotal positions, which may be
			denoted by the keywords New Philology and New Phylogeny: New Philology emphasises the variety in
			transmission and the ensuing instability of medieval texts. Its tendency is to undermine the hierarchy
			of individual manuscript sources in the interest of the fundamentally variable, unstable status
			of medieval manuscript culture. New Phylogeny, by contrast, clings to manuscript interrelations
			and groupings as the basis for the critical determination of the text. The term „phylogeny“, which
			derives from evolutionary biology, denotes the race-history of breeds. Recently it has been applied
			to questions of manuscript interrelations. Research on Chaucer, for example, has attempted, in an
			article published in the magazine
			<i>Nature</i>, to establish The Phylogeny of the Canterbury Tales (vol. 394, issue 6696,
			27-8-1998, p. 839). <br />
			A new critical edition of <i>Parzival</i> will have to come to terms with the abundance of
			variant readings and the not inconsiderable problems of establishing a text against the
			methodological background of the polarity of New Philology and New Phylogeny. A challenge that
			was voiced in the <i>Parzival</i> scholarship of the 1960s now seems more relevant than ever
			before. It was then argued that it was necessary „to publish all the material that was
			collected for critical assessment before the question of manuscript interrelation could be
			clarified“ (E. Nellmann). Perhaps the idea, when it was voiced in 1968, had an Utopian ring.
			Today, however, it can be put into practice with the aid of digital technology. A critical
			digital edition is the indispensable prerequisite for any new edition of <i>Parzival</i>.
		</p>

		<h2>The Parzival-project</h2>

		<p>
			In a project funded by the Swiss National Science Foundation (SNF) a research team at Berne
			University headed by Prof. Dr. Michael Stolz is currently preparing the basis for a new
			digital edition of Wolfram’s <i>Parzival</i>. Following the concept of „Fassungen“ developed
			by Joachim Bumke, the team members work on an edition of four versions: *D (based on ms. D
			a.o.), *m (based on mss. mno a.o.), *G (based on ms. GI LM OQR Z a.o.), and *T (based on mss.
			TUVW a.o.).
		</p>

		<h2>Digital edition</h2>

		<p>
			The possibilities offered by the synoptic representation of the manuscript sources on screen
			are shown in th digital edition. <br />

			There is no doubt that, on the digital screen, the variability postulated by New Philology can
			be presented in much more lucid, visual terms than in conventional editions of texts. The
			critical apparatus of the traditional kind generally only present readings in punctual
			fashion, reproducing word-for-word variants. On the screen, however, the variety of readings
			in the manuscripts, in context, can be encompassed. The second important advantage of digital
			display lies, however, in the presentation of manuscript groupings advocated by New Phylogeny.
			In this context, computer programmes open new fields of experiment and accelerate analytical
			processes. They facilitate the flexible disposition of manuscript groupings and enable the
			rapid revision of philological judgements concerning base manuscripts and stemmatic
			interrelations. <br />
			Thus digital display enables a synthesis of philological positions, which might at first sight appear
			contradictory. Such a synthesis offers a work-tool, and an indispensable prerequisite for any future
			critical edition of <i>Parzival</i>. At the same time, the digital display amounts to a form
			of edition which has its own peculiar nature and justification. The new
			<i>Parzival</i>-edition to some extent enables its users to participate in the editorial
			process, leaving to them the freedom to decide between different textual variants and the form
			in which they are transmitted in the manuscripts. The manuscript data produced by this process
			are of interest to both literary and linguistic historians. <br />
			In employing this digital medium, users are embedded in a century-old process of transmission -
			from the post-Gutenberg era they go back to the age before Gutenberg. Here the relevance of digital
			editions of medieval texts in terms of cultural historiography becomes evident. These editions tally
			with developments in historiographical scholarship, which is devoting itself increasingly to mediality,
			to the history of transmission, to discourse analysis, and to anthropological problems. Political
			historiography, oriented towards great historical events, has given way to social historiography,
			history defined in terms of human labour, but that is now in turn being succeded by a focus upon
			mediality, transmission, and the preservation of historical data. Homo laborans is making way for
			homo tradens of historical anthropology.
		</p>
	</div>
{/if}
