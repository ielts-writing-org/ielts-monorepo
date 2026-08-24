<script lang="ts">
	import TutorPanel from '../_components/TutorPanel.svelte';
	import { Lightbulb, Pilcrow } from '@lucide/svelte';
	import { getTaskContext } from '../_contexts/task-context';
	import { computeDeterministicStats, countCharacters } from '@ielts/shared';

	const taskContext = getTaskContext();

	let stats = $derived(computeDeterministicStats(taskContext.task_2.response));
</script>

<svelte:head>
	<title>Task 2 | IELTS Writing</title>
	<meta name="description" content="IELTS Writing Task 2" />
	<link rel="icon" href="/favicon.svg" />
</svelte:head>

<main class="flex flex-col gap-4 p-2 md:flex-row">
	<section class="flex flex-1 flex-col gap-4 xl:flex-2">
		<div
			class="prose flex max-w-none flex-col gap-2 rounded-md border border-base-300 bg-base-100 p-2">
			<div class="flex items-center justify-between">
				<div>
					<Lightbulb size="1em" class="inline text-primary" />
					<p class="inline font-bold text-primary uppercase">Writing task 2 topic</p>
				</div>
				<span class="text-sm">
					{countCharacters(taskContext.task_2.topic)}/350 characters
				</span>
			</div>
			<div
				class="textarea w-full flex-1"
				spellcheck="false"
				contenteditable="plaintext-only"
				bind:innerText={taskContext.task_2.topic}>
			</div>
		</div>

		<div class="flex flex-1 flex-col rounded-md border border-base-300 bg-base-100">
			<div class="prose flex max-w-none flex-1 flex-col gap-2 border-b border-base-300 p-2">
				<div class="flex items-center justify-between">
					<div>
						<Pilcrow size="1em" class="inline align-text-bottom text-primary" />
						<p class="inline font-bold text-primary uppercase">Essay workspace</p>
					</div>
					<span class="text-sm">{stats.words}/250 words</span>
				</div>
				<div
					class="textarea w-full flex-1"
					spellcheck="false"
					contenteditable="plaintext-only"
					bind:innerText={taskContext.task_2.response}>
				</div>
			</div>

			<div
				class="flex flex-wrap gap-x-4 gap-y-2 rounded-b-lg bg-base-300 p-2 text-sm font-semibold">
				<p>Paragraphs: {stats.paragraphs}</p>
				<p>Sentences: {stats.sentences}</p>
				<p>Characters: {stats.characters}</p>
				<p>Avg. Sentence Length: {stats.averageSentenceLength.toFixed(0)} words</p>
			</div>
		</div>
	</section>

	<TutorPanel />
</main>
