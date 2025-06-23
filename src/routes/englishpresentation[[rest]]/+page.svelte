<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';
	let hoveredH2 = $state({ value: null });
</script>

<div class="container mx-auto typography">
	<h1>Wolfram von Eschenbach, <i>Parzival</i>.<br />A New Critical Electronic Edition</h1>
	<H2Hoverable {hoveredH2} id="introductory">Introductory</H2Hoverable>

	<p>
		Tolfram von Eschenbach’s <i>Parzival</i> ranks as one of the most significant narrative works to
		emerge from medieval Europe. Composed between 1200 and 1210, it combines the Arthurian material
		of Celtic origin with the religious subject-matter of the Holy Grail. The central question in
		the work is how a world torn apart by contradictions and conflicts can again be rendered whole.
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

	<H2Hoverable {hoveredH2} id="methodological-context">Methodological context</H2Hoverable>

	<p>
		The challenge presented to the editor of <i>Parzival</i>
		also relates to central problems in the theory of medieval philology today. Worthy of note in this
		context are phenomena such as the relationship between oral performance and its literary codification,
		the ensuing variability of medieval texts, as well as concepts of authorship and transmission, and
		their effects upon the way in which a text is presented. <br />
		To put it in its simplest terms, scholarly debate hinges upon two pivotal positions, which may be
		denoted by the keywords New Philology and New Phylogeny: New Philology emphasises the variety in
		transmission and the ensuing instability of medieval texts. Its tendency is to undermine the hierarchy
		of individual manuscript sources in the interest of the fundamentally variable, unstable status of
		medieval manuscript culture. New Phylogeny, by contrast, clings to manuscript interrelations and
		groupings as the basis for the critical determination of the text. The term „phylogeny“, which derives
		from evolutionary biology, denotes the race-history of breeds. Recently it has been applied to questions
		of manuscript interrelations. Research on Chaucer, for example, has attempted, in an article published
		in the magazine <i>Nature</i>, to establish The Phylogeny of the Canterbury Tales (vol. 394,
		issue 6696, 27-8-1998, p. 839). <br />
		A new critical edition of <i>Parzival</i> will have to come to terms with the abundance of
		variant readings and the not inconsiderable problems of establishing a text against the
		methodological background of the polarity of New Philology and New Phylogeny. A challenge that
		was voiced in the <i>Parzival</i> scholarship of the 1960s now seems more relevant than ever
		before. It was then argued that it was necessary „to publish all the material that was collected
		for critical assessment before the question of manuscript interrelation could be clarified“ (E.
		Nellmann). Perhaps the idea, when it was voiced in 1968, had an Utopian ring. Today, however, it
		can be put into practice with the aid of digital technology. A critical digital edition is the
		indispensable prerequisite for any new edition of <i>Parzival</i>.
	</p>

	<H2Hoverable {hoveredH2} id="the-parzival-project">The Parzival-project</H2Hoverable>

	<p>
		In a project funded by the Swiss National Science Foundation (SNF) a research team at Berne
		University headed by Prof. Dr. Michael Stolz is currently preparing the basis for a new digital
		edition of Wolfram’s <i>Parzival</i>. Following the concept of „Fassungen“ developed by Joachim
		Bumke, the team members work on an edition of four versions: *D (based on ms. D a.o.), *m (based
		on mss. mno a.o.), *G (based on ms. GI LM OQR Z a.o.), and *T (based on mss. TUVW a.o.).
	</p>

	<H2Hoverable {hoveredH2} id="sample-edition">Sample edition</H2Hoverable>

	<p>
		The possibilities offered by the synoptic representation of the manuscript sources on screen are
		shown on the site
		<a href="editionen" target="_self">Editionsproben</a>, which contains two edition types:
		editions of textual versions and editions of a single text (following the main ms. D, St-Gall,
		Abbey library, cod. 857). <br />

		There is no doubt that, on the digital screen, the variability postulated by New Philology can
		be presented in much more lucid, visual terms than in conventional editions of texts. The
		critical apparatus of the traditional kind generally only present readings in punctual fashion,
		reproducing word-for-word variants. On the screen, however, the variety of readings in the
		manuscripts, in context, can be encompassed. The second important advantage of digital display
		lies, however, in the presentation of manuscript groupings advocated by New Phylogeny. In this
		context, computer programmes open new fields of experiment and accelerate analytical processes.
		They facilitate the flexible disposition of manuscript groupings and enable the rapid revision
		of philological judgements concerning base manuscripts and stemmatic interrelations. <br />
		Thus digital display enables a synthesis of philological positions, which might at first sight appear
		contradictory. Such a synthesis offers a work-tool, and an indispensable prerequisite for any future
		critical edition of <i>Parzival</i>. At the same time, the digital display amounts to a form of
		edition which has its own peculiar nature and justification. The new <i>Parzival</i>-edition to
		some extent enables its users to participate in the editorial process, leaving to them the
		freedom to decide between different textual variants and the form in which they are transmitted
		in the manuscripts. The manuscript data produced by this process are of interest to both
		literary and linguistic historians. <br />
		In employing this digital medium, users are embedded in a century-old process of transmission - from
		the post-Gutenberg era they go back to the age before Gutenberg. Here the relevance of digital editions
		of medieval texts in terms of cultural historiography becomes evident. These editions tally with
		developments in historiographical scholarship, which is devoting itself increasingly to mediality,
		to the history of transmission, to discourse analysis, and to anthropological problems. Political
		historiography, oriented towards great historical events, has given way to social historiography,
		history defined in terms of human labour, but that is now in turn being succeded by a focus upon
		mediality, transmission, and the preservation of historical data. Homo laborans is making way for
		homo tradens of historical anthropology.
	</p>
</div>
