<script>
	import { page } from '$app/state';
	let newLink = new URL(`https://parzdb.parzival.unibe.ch${page.url.pathname}${page.url.search}`);
</script>

<div class="container mx-auto typography">
	<h1>Parzival-Archivversion</h1>
	<p>
		Die bisher unter der Adresse https://parzival.unibe.ch/parzdb zugängliche Edition wurde Anfang
		2026 durch eine neue Umsetzung abgelöst (https://parzival.unibe.ch). Die älteren Inhalte finden
		sich unter <a href="https://parzdb.parzival.unibe.ch" target="_blank"
			>https://parzdb.parzival.unibe.ch</a
		>
		bzw. über den Verweis "Archivversion" im Menü.
	</p>
	<p>
		Ihr ursprünglicher Link in der Archivversion:
		<a href={newLink.href} target="_blank">{newLink.href}</a>.
	</p>
</div>
