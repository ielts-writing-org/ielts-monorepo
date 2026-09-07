<script lang="ts">
	import { resolve } from "$app/paths";
	import ErrorModal from "$lib/components/ErrorModal.svelte";
	import ThemeToggle from "$lib/components/ThemeToggle.svelte";
	import { ArrowLeft } from "@lucide/svelte";

	let { children } = $props();
</script>

<header class="navbar sticky top-0 z-50 mb-2 bg-base-200 shadow">
	<div class="navbar-start lg:gap-4">
		<a href={resolve("/")} class="btn btn-sm not-lg:btn-ghost lg:btn-md">
			<ArrowLeft size="1em" />
			<span class="hidden lg:inline">Dashboard</span>
		</a>
		<div>
			<h2 class="font-bold lg:hidden">Task 2</h2>
			<h2 class="hidden font-bold lg:block">IELTS Writing Task 2</h2>
			<h3 class="hidden text-xs lg:block">Write an essay on the given topic</h3>
		</div>
	</div>

	<div class="navbar-end">
		<ThemeToggle />
	</div>
</header>

<ErrorModal />

{@render children()}
