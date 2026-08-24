<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { Pathname } from '$app/types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowRight, Check, ChevronRight, Clock3, MessageCircle, Sparkles } from '@lucide/svelte';

	const sessions = [
		{
			task: 'Task 2',
			title: 'Opinion: Remote Working Impact',
			meta: 'Yesterday',
			area: 'Task Response',
			band: '6.5'
		},
		{
			task: 'Task 1',
			title: 'Bar Chart: Energy Consumption',
			meta: '3 days ago',
			area: 'Grammar Range',
			band: '7.0'
		},
		{
			task: 'Task 2',
			title: 'Discussion: University Tuition Fees',
			meta: '5 days ago',
			area: 'Coherence',
			band: '6.5'
		}
	];

	const criteria = [
		{
			name: 'Task Response / Achievement',
			direction: 'up',
			score: '6.5',
			bar: 'w-[73%] bg-[#5a50ea]',
			scoreColor: 'text-[#5045eb]',
			note: 'Main idea clear; expand supporting arguments.'
		},
		{
			name: 'Coherence & Cohesion',
			direction: 'steady',
			score: '7.0',
			bar: 'w-[78%] bg-[#8841ea]',
			scoreColor: 'text-[#5045eb]',
			note: 'Logical paragraphing; diverse linking words.'
		},
		{
			name: 'Lexical Resource',
			direction: 'up',
			score: '7.0',
			bar: 'w-[78%] bg-[#07966e]',
			scoreColor: 'text-[#039b78]',
			note: 'Good academic collocations; reduce repetition.'
		},
		{
			name: 'Grammar Range & Accuracy',
			direction: 'up',
			score: '6.0',
			bar: 'w-[60%] bg-[#e58600]',
			scoreColor: 'text-[#e68500]',
			note: 'Accurate simple sentences; watch comma splices.'
		}
	];

	const gotoTask2 = () => {
		goto(resolve(localizeHref('/tasks/2') as Pathname));
	};
</script>

<svelte:head>
	<title>LexisWriting | Practice</title>
	<meta name="description" content="IELTS Writing practice dashboard" />
</svelte:head>

<main class="w-full px-3 py-4 sm:px-6 sm:py-6 lg:px-9">
	<section
		class="flex min-h-24.5 w-full flex-col items-start justify-between gap-4 rounded-xl border border-[#cbd3ff] bg-white px-4 py-3 sm:flex-row sm:items-center sm:px-5"
		aria-label="Recommended practice">
		<div class="min-w-0">
			<div class="flex flex-wrap items-center gap-2 text-[10px] font-bold text-[#6c7890]">
				<span class="rounded bg-[#eef0ff] px-1.5 py-1 text-[9px] text-[#5861eb]">
					RECOMMENDED FOR YOU
				</span>
				<b>
					Focus Area: Task Response <i class="mx-1 text-[#b8c0ce] not-italic">•</i>
					Est. 40 min
				</b>
			</div>
			<h1 class="my-1.5 text-[16px] font-bold">
				Task 2 - Opinion Essay: Community Service in High School
			</h1>
			<p class="max-w-3xl text-[11px] leading-[1.4] text-[#66738a]">
				“Your recent essays demonstrate strong lexical range (Band 7.0), but your arguments need
				deeper explanation and concrete examples to reach Band 7.5+ in Task Response.”
			</p>
		</div>
		<button
			class="inline-flex min-h-9.5 shrink-0 items-center justify-center gap-1 rounded-lg bg-[#5146e8] px-4 text-[11px] font-extrabold text-white">
			Practice this task <ArrowRight size={15} strokeWidth={2.5} />
		</button>
	</section>

	<div class="my-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
		<h2 class="text-[15px] font-bold">What do you want to practice?</h2>
		<span class="text-[11px] text-[#79859a]">Select an IELTS Writing format to begin</span>
	</div>
	<section class="grid w-full grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
		<div class="grid grid-cols-1 gap-3.5 md:grid-cols-2">
			<article
				class="flex min-h-75 flex-col overflow-hidden rounded-xl border border-[#e1e6ef] bg-white p-4">
				<div
					class="flex justify-between gap-1.5 text-[8px] font-bold whitespace-nowrap text-[#6f7e93]">
					<span class="rounded bg-[#f0f2ff] px-1.5 py-1 text-[#5861eb]">
						TASK 1 <b>• 33% SCORE WEIGHT</b>
					</span>
					<span class="flex items-center gap-1">
						<Clock3 size={12} /> 20 mins • min 150 words
					</span>
				</div>
				<h3 class="my-3 text-[13px] font-bold">Academic Visual Report</h3>
				<p class="mb-2 truncate text-[10px] text-[#69768b]">
					Summarize, describe, or explain visual data. Present an overview.
				</p>
				<strong class="mb-1 text-[9px] text-[#7a879b]">Supported Visual Types:</strong>
				<div class="flex flex-wrap gap-1.5">
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Line Graph
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Bar Chart
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Pie Chart
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Table
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Process Diagram
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Map Comparison
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Multiple Visuals
					</span>
				</div>
				<button
					class="mt-auto inline-flex min-h-8.5 w-full items-center justify-center rounded-lg border-[1.5px] border-[#5b50fa] bg-white px-3 text-[10px] font-extrabold text-[#574cf0]">
					Start Task 1 Practice
				</button>
			</article>
			<article
				class="flex min-h-75 flex-col overflow-hidden rounded-xl border-2 border-[#5a4ffc] bg-white p-3.75">
				<div
					class="flex justify-between gap-1.5 text-[8px] font-bold whitespace-nowrap text-[#6f7e93]">
					<span class="rounded bg-[#f0f2ff] px-1.5 py-1 text-[#5861eb]">
						TASK 2 <b>• 67% SCORE WEIGHT (2x)</b>
					</span>
					<span class="flex items-center gap-1">
						<Clock3 size={12} /> 40 mins • min 250 words
					</span>
				</div>
				<h3 class="my-3 text-[13px] font-bold">Academic Discursive Essay</h3>
				<p class="mb-2 truncate text-[10px] text-[#69768b]">
					Write a formal academic essay presenting structured arguments.
				</p>
				<strong class="mb-1 text-[9px] text-[#7a879b]">Supported Question Types:</strong>
				<div class="flex flex-wrap gap-1.5">
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Opinion (Agree/Disagree)
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Discussion (Both Views)
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Advantages &amp; Disadvantages
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Problems &amp; Solutions
					</span>
					<span
						class="rounded border border-[#e4e9f0] bg-[#f0f3f8] px-1.5 py-1 text-[8px] text-[#56647a]">
						Two-Part Direct Questions
					</span>
				</div>
				<button
					class="mt-auto inline-flex min-h-8.5 w-full items-center justify-center gap-1 rounded-lg bg-[#5146e8] px-4 text-[10px] font-extrabold text-white"
					onclick={gotoTask2}>
					Start Task 2 Practice <ArrowRight size={15} strokeWidth={2.5} />
				</button>
			</article>
		</div>

		<aside class="overflow-hidden rounded-xl border border-[#e1e6ef] bg-white p-4">
			<div class="mb-4 flex justify-between gap-2">
				<div>
					<h2 class="text-[13px] font-bold">Four-Criteria Evaluation</h2>
					<p class="mt-1 text-[9px] whitespace-nowrap text-[#738097]">
						Official IELTS assessment criteria breakdown across past sessions
					</p>
				</div>
				<span
					class="h-fit rounded bg-[#f0f0ff] px-1.5 py-1 text-[8px] font-extrabold whitespace-nowrap text-[#5c51e8]">
					AI Estimated Band: 6.5
				</span>
			</div>
			{#each criteria as criterion (criterion.name)}
				<div class="mb-4">
					<div class="flex justify-between text-[10px]">
						<strong>
							{criterion.name}
							<em
								class:text-[#6d7688]={criterion.direction === 'steady'}
								class="ml-0.5 text-[#039b78] not-italic">
								{criterion.direction === 'steady' ? '→' : '↑'}
							</em>
						</strong>
						<b class={criterion.scoreColor}>{criterion.score}</b>
					</div>
					<div class="my-1.5 h-1.25 overflow-hidden rounded bg-[#edf0f5]">
						<span class={`block h-full rounded ${criterion.bar}`}></span>
					</div>
					<small class="text-[8px] text-[#8290a4]">{criterion.note}</small>
				</div>
			{/each}
			<p class="m-0 text-[8px] text-[#8290a4]">
				▣ Diagnostic estimate based on official public descriptors. Not an official IELTS score.
			</p>
		</aside>
	</section>

	<section class="mt-6 grid w-full grid-cols-1 gap-4 lg:grid-cols-[1.58fr_1fr]">
		<div class="rounded-xl border border-[#e1e6ef] bg-white p-3.5">
			<div class="mb-2.5 flex items-center justify-between">
				<h2 class="text-[12px] font-bold">Recent Practice Sessions</h2>
				<a
					class="flex items-center text-[9px] font-extrabold text-[#5a50ea] no-underline"
					href={resolve('/')}>
					View complete history <ChevronRight size={14} />
				</a>
			</div>
			{#each sessions as session (session.title)}
				<div
					class="mt-1.5 grid min-h-7.5 grid-cols-[42px_minmax(0,1fr)_43px] items-center gap-1.5 rounded-md bg-[#f1f4f8] px-2.5 text-[9px] sm:grid-cols-[42px_minmax(170px,1fr)_55px_110px_43px]">
					<span class="w-fit rounded bg-[#e8eaff] px-1.5 py-1 text-[8px] text-[#5a50eb]">
						{session.task}
					</span>
					<strong class="truncate">{session.title}</strong>
					<small class="hidden text-[8px] text-[#7d899c] sm:block">{session.meta}</small>
					<span class="hidden text-right text-[8px] text-[#7d899c] sm:block">
						Area: {session.area}
					</span>
					<b class="text-right text-[9px]">Band {session.band}</b>
				</div>
			{/each}
		</div>
		<div class="relative min-h-37.75 overflow-hidden rounded-xl bg-[#10182e] p-4 text-white">
			<div class="text-[8px] font-extrabold text-[#8293f2]">
				<MessageCircle size={11} /> CONVERSATIONAL TUTOR
			</div>
			<h2 class="my-2 text-[13px] font-bold">Real-Time Socratic Guidance While You Write</h2>
			<p class="max-w-[320px] text-[9px] leading-[1.4] text-[#a3afc3]">
				Get contextual hints mapped to official IELTS criteria right as you construct paragraphs. No
				full essay rewrites — pure guided learning.
			</p>
			<div class="mt-6 flex flex-wrap gap-3 text-[8px] font-bold text-[#d5b829]">
				<span class="text-[#54b997]"><Check size={12} /> Sentence-level cues</span>
				<span><Check size={12} /> Socratic questions</span>
				<span><Check size={12} /> 4-criteria checks</span>
			</div>
			<Sparkles class="absolute top-4 right-4 text-[#424a69]" size={22} />
		</div>
	</section>
</main>
