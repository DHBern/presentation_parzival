<script>
	import { page } from '$app/state';
	import { base } from '$app/paths';
</script>

<div class="container pt-10 mx-auto typography">
	{#if page.status === 404}
		<h1>{page.status}: Seite nicht gefunden</h1>
		<p>Die angeforderte Seite existiert nicht. <a href="{base}/">Zur Startseite</a></p>
	{:else}
		<h1>{page.status}: {page.error.message}</h1>
		<p>Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.</p>
	{/if}
</div>
