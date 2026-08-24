<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { Pathname } from '$app/types';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();
</script>

<div
	class="min-h-screen w-full bg-[#fbfcff] font-sans text-[#202b40] antialiased [&_button]:text-[12px]! [&_h1]:text-[18px]! [&_h2]:text-[16px]! [&_h3]:text-[15px]! [&_nav_a]:text-[13px]! [&_p]:text-[12px]! [&_small]:text-[10px]! [&_span]:text-[10px]!">
	<header
		class="flex min-h-13.5 w-full flex-wrap items-center gap-4 border-b border-[#e2e7f1] bg-white px-4 py-2 sm:px-6 lg:flex-nowrap lg:gap-10 lg:px-9">
		<a
			class="flex min-w-29 items-center gap-2 text-[#202b40] no-underline"
			href={resolve('/')}
			aria-label="LexisWriting home">
			<span
				class="grid h-7.25 w-7.25 place-items-center rounded-lg bg-[#5045e8] text-[12px] font-extrabold text-white">
				AI
			</span>
			<span class="flex flex-col leading-[1.1] whitespace-nowrap">
				<strong class="text-[14px]">LexisWriting</strong>
				<small class="mt-0.5 text-[8px] text-[#8792a6]">IELTS Academic AI Tutor</small>
			</span>
		</a>
		<nav
			class="order-3 flex h-8 w-full items-center justify-between gap-1 lg:order-0 lg:h-auto lg:w-auto lg:gap-3"
			aria-label="Main navigation">
			<a
				class="rounded-lg bg-[#eef0ff] px-3 py-1.5 text-[12px] font-bold text-[#5045e8] no-underline"
				href={resolve('/')}>
				Practice
			</a>
			<a
				class="rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#45536b] no-underline"
				href={resolve('/')}>
				Progress
			</a>
			<a
				class="rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#45536b] no-underline"
				href={resolve('/')}>
				History
			</a>
			<a
				class="rounded-lg px-3 py-1.5 text-[12px] font-bold text-[#45536b] no-underline"
				href={resolve('/')}>
				AI Tutor
			</a>
		</nav>
		<div class="ml-auto flex items-center gap-2 text-[10px] font-bold whitespace-nowrap sm:gap-3">
			<span class="hidden rounded-2xl border border-[#f5d994] px-2 py-1 text-[#d88400] sm:inline">
				🔥 5-Day Streak
			</span>
			<span class="hidden rounded-2xl bg-[#f0f3f7] px-2.5 py-1.5 text-[#68758a] sm:inline">
				Target: Band 7.5
			</span>
			<span
				class="grid h-7.5 w-7.5 place-items-center rounded-full bg-[#5045e8] text-[11px] text-white">
				PT
			</span>
		</div>
	</header>

	{@render children()}
</div>

<div style="display:none">
	{#each locales as locale (locale)}
		<a href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}>{locale}</a>
	{/each}
</div>
