<script lang="ts">
	import ChatPanel from "$lib/features/chat/ChatPanel.svelte";
	import EvaluationPanel from "$lib/features/evaluation/EvaluationPanel.svelte";
	import { Lightbulb, Pilcrow } from "@lucide/svelte";
	import { LocalLinter } from "harper.js";
	import { onDestroy, onMount } from "svelte";

	const { data } = $props();

	let taskState = $state<{ topic: string; response: string }>({ topic: "", response: "" });
	let linter = $state<import("harper.js").LocalLinter>();

	onMount(async () => {
		taskState = { topic: data.topic, response: data.response };

		const { binary } = await import("harper.js/binary");
		linter = new LocalLinter({ binary });
	});

	onDestroy(() => {
		linter?.dispose();
	});
</script>

<svelte:head>
	<title>Task {data.taskId} | IELTS Writing</title>
	<meta name="description" content={data.pageTitle} />
</svelte:head>

<main class="flex flex-col gap-4 p-2 md:flex-row">
	<section class="flex flex-1 flex-col gap-4 md:h-[calc(100dvh-6rem)] xl:flex-2">
		<div class="flex flex-col rounded-md border border-base-content/20 bg-base-100">
			<div class="prose flex max-w-none flex-1 items-center gap-1 p-2">
				<Lightbulb size="1em" class="inline text-primary" />
				<div class="inline font-bold text-primary uppercase">TOPIC</div>
			</div>
			{#if data.taskId === 2}
				{#if linter}
					{let isReady = $state<boolean>(false)}
					{#if !isReady}
						<div class="flex h-full max-w-full flex-col items-center justify-center gap-2">
							<span class="loading loading-bars text-primary"></span>
							<p class="text-sm">Loading editor...</p>
						</div>
					{/if}
					{#await import("$lib/features/harper-editor/Editor.svelte") then { default: Editor }}
						<Editor
							{linter}
							bind:content={taskState.topic}
							defaultFontFamily="serif"
							onReady={() => (isReady = true)} />
					{/await}
				{/if}
			{/if}
		</div>

		<div class="flex min-h-0 flex-1 flex-col rounded-md border border-base-content/20 bg-base-100">
			<div class="prose flex max-w-none items-center gap-1 p-2">
				<Pilcrow size="1em" class="inline align-text-bottom text-primary" />
				<div class="inline font-bold text-primary uppercase">Your response</div>
			</div>
			{#if linter}
				{let isReady = $state<boolean>(false)}
				{#if !isReady}
					<div class="flex h-full flex-col items-center justify-center gap-2">
						<span class="loading loading-bars text-primary"></span>
						<p class="text-sm">Loading editor...</p>
					</div>
				{/if}
				{#await import("$lib/features/harper-editor/Editor.svelte") then { default: Editor }}
					<Editor
						{linter}
						bind:content={taskState.response}
						defaultFontFamily="serif"
						onReady={() => (isReady = true)} />
				{/await}
			{/if}
		</div>
	</section>

	<aside class="sticky top-[10.5%] flex h-[calc(100dvh-6rem)] flex-1 flex-col gap-4 xl:top-[9.5%]">
		<EvaluationPanel taskContext={taskState} />
		<ChatPanel taskContext={taskState} />
	</aside>
</main>
