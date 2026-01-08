<script>
	import slugify from 'slugify';
	import '@fortawesome/fontawesome-free/css/all.css';
	let { id = null, name = '', classes = '', children = null, locale = 'de' } = $props();
	id = name
		? slugify(name, { locale: locale, lower: true, strict: true })
		: id
			? id
			: Math.floor(Math.random() * 100000);
</script>

<h2 {id} class={classes}>
	<a href={`#${id}`} class="inline-block">
		{#if children}
			{@render children()}
		{:else}
			{name}
		{/if}
	</a>
</h2>

<style>
	h2 {
		display: flex;
		align-items: center;
		position: relative;
		margin-top: 1em;
	}
	h2::after {
		content: '\f0c1';
		font-family: 'Font Awesome 7 Free';
		font-weight: 900;
		-webkit-font-smoothing: antialiased;
		margin-left: 0.5em;
		visibility: hidden;
	}

	h2:hover::after {
		visibility: visible;
		opacity: 0.33;
	}
</style>
