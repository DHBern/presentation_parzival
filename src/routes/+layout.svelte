<script>
	import '../app.css';
	import '@fortawesome/fontawesome-free/css/solid.min.css';
	import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
	import { AppBar, Modal } from '@skeletonlabs/skeleton-svelte';
	import { page } from '$app/state';
	import { base } from '$app/paths';
	import { toaster } from '$lib/components/toaster';
	import { Toaster } from '@skeletonlabs/skeleton-svelte';
	/** @type {{children?: import('svelte').Snippet}} */
	let { children } = $props();

	let classesActive = $derived((/** @type {string} */ href) =>
		base + href === `/${page.url.pathname.split('/')[1]}`
			? 'bg-primary-300 hover:bg-primary-300 hover:text-primary-700 text-primary-900'
			: 'hover:text-primary-600'
	);

	let openState = $state(false);

	function modalClose() {
		openState = false;
	}

	const pages = [
		{ slug: 'Einführung', path: '/einfuehrung' },
		{ slug: 'Dreißiger-Matrix', path: `/#edition-nach-dreissigern` },
		{ slug: 'English Presentation', path: '/englishpresentation' },
		{ slug: 'Handschriftenverzeichnis', path: '/hsverz' },
		{ slug: 'Mitarbeitende', path: '/mitarbeitende' },
		{ slug: 'Projektpräsentationen', path: '/projektpraesentationen' },
		{ slug: 'Fassungen', path: '/fassungen' },
		{ slug: 'Monotext', path: '/monotext' },
		{ slug: 'Suche', path: '/suche' }
	];
</script>

<AppBar classes="px-4 py-0">
	{#snippet lead()}
		<a class="text-xl uppercase font-bold hover:text-primary-700" href={`${base}/`}>Parzival</a>
	{/snippet}
	<nav class="">
		<ul class="hidden items-center flex-none lg:flex lg:flex-wrap">
			{#each pages as page}
				<li class="list-nav-item inline-block h-full p-4 {classesActive(page.path)}">
					<a href={`${base}${page.path}`}>{page.slug}</a>
				</li>
			{/each}
		</ul>
	</nav>
	{#snippet trail()}
		<Modal
			open={openState}
			onOpenChange={(e) => (openState = e.open)}
			positionerJustify="justify-start"
			positionerAlign=""
			positionerPadding="p-10"
			transitionsPositionerIn={{ y: -480, duration: 200 }}
			transitionsPositionerOut={{ y: -480, duration: 200 }}
			backdropClasses="backdrop-blur-xl"
		>
			{#snippet trigger()}
				<!-- this is an anchor tag because of node_invalid_placement warning -->
				<!-- svelte-ignore a11y_missing_attribute -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<a tabindex="0" role="button" aria-label="Menü" class="lg:!hidden btn-icon">
					<i class="fa-solid fa-bars"></i>
				</a>
			{/snippet}
			{#snippet content()}
				<nav class="list-nav">
					<ul>
						{#each pages as page}
							<li>
								<a href={`${base}${page.path}`} onclick={modalClose}>
									<span class="flex-auto">{page.slug}</span>
								</a>
							</li>
						{/each}
					</ul>
				</nav>
			{/snippet}
		</Modal>
	{/snippet}
</AppBar>

<main id="page-content" class="flex-auto px-4">
	{@render children?.()}
</main>

<Toaster {toaster}></Toaster>
