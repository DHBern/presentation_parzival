<script>
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<div class="container mx-auto typography">
	<h1>Eintextedition</h1>

	<p>
		Die Eintextedition stellt den Text des Parzival in einer einzigen, durchgehenden Ansicht im PDF Format
		dar.
	</p>

	<embed
		src="https://dhbern.github.io/parzival-static-api/api/export/pdf/monopsen.pdf"
		width="100%"
		height="800px"
		type="application/pdf"
	/>
</div>
