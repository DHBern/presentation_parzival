<script>
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import VerseSelector from '$lib/components/VerseSelector.svelte';
</script>

<div class="container pt-10 mx-auto typography">
	<h2 class="h2 pb-6">Fehler</h2>
	<p>{page.error?.message}</p>
	<a class="anchor" href="{base}/einzelverssynopse/1/1">Zum ersten Vers</a>
	<VerseSelector targetPath="/einzelverssynopse" />
</div>
