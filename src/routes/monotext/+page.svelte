<script>
	import ExpandableContent from '$lib/components/ExpandableContent.svelte';
	import ErlaeuterungenEintextEdition
		from '$lib/components/erlaeuterungen-components/ErlaeuterungenEintextEdition.svelte';
</script>

<div class="container mx-auto typography">
	<h1>Eintextedition</h1>
	<ExpandableContent clampClass = 'line-clamp-2'  class="mb-8">
		<ErlaeuterungenEintextEdition />
	</ExpandableContent>
	<embed
		src="https://dhbern.github.io/parzival-static-api/api/pdf/eintextedition.pdf"
		width="100%"
		height="800px"
		type="application/pdf"
	/>
</div>
