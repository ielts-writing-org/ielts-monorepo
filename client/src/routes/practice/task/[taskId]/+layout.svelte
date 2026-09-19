<script lang="ts">
	import { resolve } from "$app/paths";
	import ErrorModal from "$lib/core/error/ErrorModal.svelte";
	import ThemeToggle from "$lib/features/theme/ThemeToggle.svelte";
	import { ArrowLeft } from "@lucide/svelte";
	import { page } from "$app/state";

	const { children, data } = $props();
</script>

<header class="navbar sticky top-0 z-50 mb-2 bg-base-200 shadow">
	<div class="navbar-start lg:gap-4">
		<a
			href={resolve("/")}
			class="btn btn-sm not-lg:btn-ghost lg:btn-md"
			aria-label="Back to Dashboard">
			<ArrowLeft size="1em" />
			<span class="hidden lg:inline">Dashboard</span>
		</a>
		<div>
			<h2 class="font-bold">{page.data.pageTitle}</h2>
			<h3 class="hidden text-xs lg:block">{page.data.pageSubtitle}</h3>
		</div>
	</div>
	<div class="navbar-center">
		<ThemeToggle currentTheme={data.theme} />
	</div>

	<div class="navbar-end">
		<div class="flex items-center gap-2 sm:gap-3">
			{#if data.session}
				<div class="badge hidden badge-outline badge-sm font-semibold badge-warning sm:inline">
					🔥 5<span class="hidden md:inline">-Day Streak</span>
				</div>
				<div class="badge hidden badge-soft badge-sm font-semibold sm:inline">Target: 7.5</div>

				<div class="text-sm font-semibold">{data.user?.name}</div>
				<div class="avatar">
					<img
						class="w-8 rounded-full ring ring-base-content/20"
						src={data.user?.image}
						alt={data.user?.name} />
				</div>
			{/if}
		</div>
	</div>
</header>

<ErrorModal />

{@render children()}
