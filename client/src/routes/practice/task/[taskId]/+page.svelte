<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
	import ChatPanel from "$lib/features/chat/ChatPanel.svelte";
	import EvaluationPanel from "$lib/features/evaluation/EvaluationPanel.svelte";
	import { Lightbulb, Pilcrow } from "@lucide/svelte";
	import { Dialect, WorkerLinter } from "harper.js";
	import { onDestroy, onMount } from "svelte";

	const { data } = $props();

	let taskState = $state<{ taskPrompt: string; taskResponse: string }>({
		taskPrompt: "",
		taskResponse: ""
	});
	const linters = $state<Array<WorkerLinter>>([]);
	let isDirty = $state<boolean>(true);

	onMount(async () => {
		taskState = { taskPrompt: data.topic, taskResponse: data.response };

		const { binary } = await import("harper.js/binary");
		linters.push(new WorkerLinter({ binary, dialect: Dialect.American }));
		linters.push(new WorkerLinter({ binary, dialect: Dialect.British }));
	});

	beforeNavigate(({ cancel }) => {
		if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) {
			cancel();
		}
	});

	onDestroy(() => {
		linters.forEach((l) => l.dispose());
	});
</script>

<svelte:head>
	<title>Task {data.taskId} | IELTS Writing</title>
	<meta name="description" content={data.pageTitle} />
</svelte:head>

<svelte:window on:beforeunload={(e) => isDirty && e.preventDefault()} />

<main class="flex flex-col gap-4 p-2 md:flex-row">
	<section class="flex flex-1 flex-col gap-4 md:h-[calc(100dvh-6rem)] xl:flex-2">
		<div class="flex min-h-0 flex-1 flex-col rounded-box border border-base-content/20 bg-base-100">
			<div class="prose flex max-w-none items-center gap-1 p-2">
				<Lightbulb size="1em" class="inline text-primary" />
				<div class="inline font-bold text-primary uppercase">Task</div>
			</div>
			{#if linters.length}
				{let isReady = $state<boolean>(false)}
				{#if !isReady}
					<div class="flex h-full max-w-full flex-col items-center justify-center gap-2">
						<span class="loading loading-bars text-primary"></span>
						<p class="text-sm">Loading editor...</p>
					</div>
				{/if}
				{#await import("$lib/features/harper-editor/Editor.svelte") then { default: Editor }}
					<Editor
						{linters}
						content={taskState.taskPrompt}
						onReady={() => (isReady = true)}
						onChange={(v) => (taskState.taskPrompt = v)} />
				{/await}
			{/if}
		</div>

		<div class="flex min-h-0 flex-2 flex-col rounded-box border border-base-content/20 bg-base-100">
			<div class="prose flex max-w-none items-center gap-1 p-2">
				<Pilcrow size="1em" class="inline align-text-bottom text-primary" />
				<div class="inline font-bold text-primary uppercase">Your response</div>
			</div>
			{#if linters.length}
				{let isReady = $state<boolean>(false)}
				{#if !isReady}
					<div class="flex h-full flex-col items-center justify-center gap-2">
						<span class="loading loading-bars text-primary"></span>
						<p class="text-sm">Loading editor...</p>
					</div>
				{/if}
				{#await import("$lib/features/harper-editor/Editor.svelte") then { default: Editor }}
					<Editor
						{linters}
						content={taskState.taskResponse}
						onReady={() => (isReady = true)}
						onChange={(v) => (taskState.taskResponse = v)} />
				{/await}
			{/if}
		</div>
	</section>

	<aside class="h-[calc(100dvh-6rem)] flex-1">
		<div role="tablist" class="tabs tabs-lift h-full">
			<label class="tab [--tab-border-color:var(--color-base-content)]/20">
				<input type="radio" name="tab" aria-label="Tab Evaluation" defaultChecked />
				Evaluation
			</label>
			<div class="tab-content border-base-content/20">
				<EvaluationPanel taskContext={taskState} taskId={data.taskId} />
			</div>

			<label class="tab [--tab-border-color:var(--color-base-content)]/20">
				<input type="radio" name="tab" aria-label="Tab Chat" />
				Chat
			</label>
			<div class="tab-content border-base-content/20">
				<ChatPanel taskContext={taskState} taskId={data.taskId} />
			</div>
		</div>
	</aside>
</main>
