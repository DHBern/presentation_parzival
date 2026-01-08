<script>
	import H2Hoverable from '$lib/components/H2Hoverable.svelte';
	import ErlaeuterungenEintextEdition from '$lib/components/erlaeuterungen-components/ErlaeuterungenEintextEdition.svelte';
	import ErlaeuterungenFassungsedition from '$lib/components/erlaeuterungen-components/ErlaeuterungenFassungsedition.svelte';
	import ErlaeuterungenTranskriptionen from '$lib/components/erlaeuterungen-components/ErlaeuterungenTranskriptionen.svelte';
</script>

<div class="container mx-auto typography">
	<h1 class="h1 mb-4">
		Erläuterungen zur Fassungsedition, zur Eintextedition und zu den Transkriptionen
	</h1>
	<H2Hoverable name="Fassungsedition"></H2Hoverable>
	<ErlaeuterungenFassungsedition />
	<H2Hoverable name="Eintextedition (Kritische Edition im PDF-Format)"></H2Hoverable>
	<ErlaeuterungenEintextEdition />
	<H2Hoverable name="Transkriptionen (auch relevant für die Darstellung in der Verssynopse)"
	></H2Hoverable>
	<ErlaeuterungenTranskriptionen />
</div>
