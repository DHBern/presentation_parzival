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

	let aboutMenu;

	const aboutProjectPages = [
		{ slug: 'Projektpräsentationen', path: '/projektpraesentationen' },
		{ slug: 'English Presentation', path: '/englishpresentation' },
		{ slug: 'Mitarbeitende', path: '/mitarbeitende' }
		// { slug: 'Erläuterungen', path: '/erl' },
		// { slug: 'Fassungsprofile', path: '/fassungsprofile' },
		// { slug: 'Editionsgrundsätze', path: '/editionsgrundsaetze' },
		// { slug: 'Transkriptionsrichtlinien', path: '/transkriptionsrichtlinien' }
	];

	const mainPages = [
		{ slug: 'Textzeugenverzeichnis', path: '/hsverz' },
		{ slug: 'Verssynopse', path: '/einzelverssynopse' },
		{ slug: 'Dreißiger-Tabelle', path: '/#edition-nach-dreissigern' },
		{ slug: 'Fassungsedition', path: '/fassungen' },
		{ slug: 'Transkriptionen', path: '/textzeugen/d/1/01' },
		{ slug: 'Eintextedition', path: '/monotext' },
		{ slug: 'Suche', path: '/suche' }
	];
</script>

<AppBar classes="px-4 py-0 relative z-50">
	{#snippet lead()}
		<a class="text-xl uppercase font-bold hover:text-primary-700 self-center" href={`${base}/`}
			>Parzival</a
		>
	{/snippet}
	<nav class="list-nav-item w-full p-4 justify-start hidden lg:flex lg:flex-wrap">
		<button
			id="about-btn"
			type="button"
			popovertarget="about-menu"
			aria-label="Über das Projekt Menü öffnen"
			aria-haspopup="true"
			aria-expanded={aboutMenu?.matches(':popover-open')}
			aria-controls="about-menu"
			class="flex items-center gap-1 hover:text-primary-600 hidden lg:flex lg:flex-wrap"
		>
			Über das Projekt <i class="fa-solid fa-chevron-down"></i>
		</button>

		<div
			bind:this={aboutMenu}
			id="about-menu"
			popover
			aria-label="Über das Projekt Menü"
			class="rounded-lg bg-surface-100 shadow-lg min-w-[14rem] py-2 text-left"
			onfocusout={(e) => !aboutMenu.contains(e.relatedTarget) && aboutMenu.hidePopover()
}
		>
			{#each aboutProjectPages as page, i}
				<div>
					<a
						href={`${base}${page.path}`}
						onclick={() => aboutMenu.hidePopover()}
						popovertarget="about-menu"
						popovertargetaction="hide"
						autofocus={i === 0}
						class="block px-4 py-2 text-sm hover:text-primary-600 text-black {classesActive(page.path)}"
					>
						{page.slug}
					</a>
				</div>
			{/each}
		</div>
		{#each mainPages as page}
			<div class="list-nav-item inline-block h-full p-4 {classesActive(page.path)}">
				<a href={`${base}${page.path}`}>{page.slug}</a>
			</div>
		{/each}
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
					<ul class="space-y-3">
						<li>
							<span class="font-semibold">Über das Projekt</span>
							<ul class="ml-4 mt-1 space-y-1">
								{#each aboutProjectPages as page}
									<li>
										<a href={`${base}${page.path}`} onclick={modalClose}>
											<span class="flex-auto">{page.slug}</span>
										</a>
									</li>
								{/each}
							</ul>
						</li>

						{#each mainPages as page}
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
