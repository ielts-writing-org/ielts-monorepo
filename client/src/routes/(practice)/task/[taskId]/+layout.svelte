<script lang="ts">
	import { resolve } from "$app/paths";
	import ErrorModal from "$lib/shared/error/ErrorModal.svelte";
	import ThemeToggle from "$lib/features/theme/ThemeToggle.svelte";
	import { ArrowLeft } from "@lucide/svelte";
	import { page } from "$app/state";

	const { children, data } = $props();
</script>

<header class="navbar sticky top-0 z-50 mb-2 bg-base-200 shadow">
	<div class="navbar-start lg:gap-4">
		<a href={resolve("/")} class="btn btn-sm not-lg:btn-ghost lg:btn-md">
			<ArrowLeft size="1em" />
			<span class="hidden lg:inline">Dashboard</span>
		</a>
		<div>
			<h2 class="font-bold">{page.data.pageTitle}</h2>
			<h3 class="hidden text-xs lg:block">{page.data.pageSubtitle}</h3>
		</div>
	</div>

	<div class="navbar-end">
		<ThemeToggle isNightTheme={data.theme === "night"} />
	</div>
</header>

<ErrorModal />

{@render children()}
