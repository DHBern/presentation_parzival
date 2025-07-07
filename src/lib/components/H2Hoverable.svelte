<script>
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	let { id, classes = '', children } = $props();
	let isHovered = $state(false);
</script>

<h2
	{id}
	class={classes}
	onmouseenter={() => {
		isHovered = true;
	}}
	onmouseleave={() => {
		isHovered = false;
	}}
>
	<a href={`#${id}`} class="inline-block">
		{@render children()}
		{#if isHovered}
			<i class="ml-2 fa-solid fa-link"></i>
		{/if}
	</a>
</h2>
