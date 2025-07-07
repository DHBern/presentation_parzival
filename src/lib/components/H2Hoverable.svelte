<script>
	// import '@fortawesome/fontawesome-free/css/solid.min.css';
	// import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import '@fortawesome/fontawesome-free/css/all.css';
	let { id, classes = '', children } = $props();
</script>

<h2 {id} class={classes}>
	<a href={`#${id}`} class="inline-block">
		{@render children()}
	</a>
</h2>

<style>
	h2 {
		display: flex;
		align-items: center;
		position: relative;
	}
	h2::after {
		content: '\f0c1';
		font-family: 'Font Awesome 6 Free';
		font-weight: 900;
		-webkit-font-smoothing: antialiased;
		margin-left: 0.5em;
		visibility: hidden;
	}

	h2:hover::after {
		visibility: visible;
	}
</style>
