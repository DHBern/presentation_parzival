<script>
	/** @type {{data: import('./$types').PageData}} */
	let { data } = $props();
</script>

<div class="container mx-auto typography">
	<h1>Monotext</h1>

	<p>
		Der Monotext stellt den Text des Parzival in einer einzigen, durchgehenden Ansicht im PDF Format
		dar.
	</p>

	<embed
		src="https://dhbern.github.io/parzival-static-api/api/export/pdf/monopsen.pdf"
		width="100%"
		height="800px"
		type="application/pdf"
	/>
</div>
