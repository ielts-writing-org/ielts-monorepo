<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { getLocale, localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	type TasksHeaderProps = {
		onEvaluate: () => void;
		isEvaluating: boolean;
	};

	let { onEvaluate, isEvaluating }: TasksHeaderProps = $props();
</script>

<header class="navbar sticky top-0 z-50 border-b border-base-300 bg-base-100">
	<div class="navbar-start lg:gap-4">
		<a
			href={resolve(localizeHref('/', { locale: getLocale() }) as Pathname)}
			class="lg:btn- btn btn-sm not-lg:btn-ghost lg:btn-md">
			<ArrowLeft size="1em" />
			<span class="hidden lg:inline">Dashboard</span>
		</a>
		<div>
			<h2 class="font-bold lg:hidden">Task 2</h2>
			<h2 class="hidden font-bold lg:block">IELTS Writing Task 2</h2>
			<h3 class="hidden text-xs lg:block">Write an essay on the given topic</h3>
		</div>
	</div>

	<ThemeToggle />

	<div class="navbar-end">
		<button class="group btn btn-primary" onclick={onEvaluate} disabled={isEvaluating}>
			<span class="loading loading-spinner not-group-disabled:hidden"></span>
			Evaluate
			<ArrowRight size="1em" />
		</button>
	</div>
</header>
