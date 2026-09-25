<script lang="ts">
	import { beforeNavigate } from "$app/navigation";
	import {
		setPracticeContext,
		type PracticeContext
	} from "$lib/contexts/practice-context.svelte.js";
	import { Lightbulb, Pilcrow } from "@lucide/svelte";
	import { Dialect, WorkerLinter } from "harper.js";
	import { onDestroy, onMount, untrack } from "svelte";
	import ChatPanel from "./_chat/ChatPanel.svelte";
	import EvaluationPanel from "./_evaluation/EvaluationPanel.svelte";

	const { data } = $props();

	const practiceContext = $state<PracticeContext>({
		task: untrack(() => data.task),
		chats: [],
		evaluateResponse: undefined
	});

	const context = setPracticeContext(practiceContext);

	let isDirty = $state<boolean>(true);
	const linters = $state<Array<WorkerLinter>>([]);

	const taskImagePreview = $derived(
		context.task.id === "1" && context.task.image
			? URL.createObjectURL(context.task.image)
			: undefined
	);

	async function handleAddImage(e: Event & { currentTarget: EventTarget & HTMLInputElement }) {
		if (context.task.id === "2") return;

		const files = e.currentTarget.files;
		if (!files) return;

		const file = files[0];

		if (taskImagePreview) {
			URL.revokeObjectURL(taskImagePreview);
		}

		context.task.image = file;
	}

	onMount(async () => {
		const { slimBinary: binary } = await import("harper.js/slimBinary");
		linters.push(new WorkerLinter({ binary, dialect: Dialect.American }));
		linters.push(new WorkerLinter({ binary, dialect: Dialect.British }));
	});

	beforeNavigate(({ cancel }) => {
		if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) {
			cancel();
		}
	});

	onDestroy(() => {
		if (taskImagePreview) {
			URL.revokeObjectURL(taskImagePreview);
		}

		linters.forEach((l) => l.dispose());
	});
</script>

<svelte:head>
	<title>Task {data.task.id} | IELTS Writing Practice Platform</title>
	<meta name="description" content={data.pageTitle} />
</svelte:head>

<svelte:window on:beforeunload={(e) => isDirty && e.preventDefault()} />

<main class="flex basis-full flex-col gap-2 p-2 lg:flex-row lg:overflow-y-hidden">
	<section class="flex flex-col gap-2 lg:flex-3 lg:overflow-y-auto xl:flex-2">
		<div class="flex flex-1 flex-col rounded-box border border-base-content/20 bg-base-100">
			<div class="flex items-center justify-between gap-1 p-2 text-sm text-primary">
				<div class="flex items-center gap-1 text-sm text-primary">
					<Lightbulb size="1em" />
					<div class="font-semibold uppercase">Task</div>
				</div>

				{#if context.task.id === "1"}
					<label class="btn btn-dash btn-primary btn-xs">
						<input type="file" class="hidden" accept="image/*" onchange={handleAddImage} />
						{context.task.image ? "Change" : "Add an"} image
					</label>
				{/if}
			</div>
			{#if linters.length}
				{let isReady = $state<boolean>(false)}
				{#if !isReady}
					<div class="flex h-full flex-col items-center justify-center gap-2">
						<span class="loading loading-bars text-primary"></span>
						<p class="text-sm">Loading editor...</p>
					</div>
				{/if}
				{#await import("./_harper-editor/Editor.svelte") then { default: Editor }}
					<div class="flex flex-1 flex-col gap-2 lg:flex-row">
						<Editor
							{linters}
							content={context.task.prompt}
							onReady={() => (isReady = true)}
							onChange={(v) => (context.task.prompt = v)} />
						{#if data.task.id === "1" && taskImagePreview}
							<div class="flex min-h-fit flex-1 items-center justify-center gap-2 overflow-hidden">
								<img src={taskImagePreview} alt="Task" class="placeholder max-w-full" />
							</div>
						{/if}
					</div>
				{/await}
			{/if}
		</div>

		<div class="flex flex-3 flex-col rounded-box border border-base-content/20 bg-base-100">
			<div class="flex items-center gap-1 p-2 text-sm text-primary">
				<Pilcrow size="1em" />
				<div class="font-semibold uppercase">Your response</div>
			</div>
			{#if linters.length}
				{let isReady = $state<boolean>(false)}
				{#if !isReady}
					<div class="flex h-full flex-col items-center justify-center gap-2">
						<span class="loading loading-bars text-primary"></span>
						<p class="text-sm">Loading editor...</p>
					</div>
				{/if}
				{#await import("./_harper-editor/Editor.svelte") then { default: Editor }}
					<Editor
						{linters}
						content={context.task.response}
						onReady={() => (isReady = true)}
						onChange={(v) => (context.task.response = v)} />
				{/await}
			{/if}
		</div>
	</section>

	<aside class="top-0 basis-md overflow-y-auto lg:sticky lg:flex-1">
		<div role="tablist" class="tabs tabs-lift h-full">
			<label class="tab [--tab-border-color:var(--color-base-content)]/20">
				<input type="radio" name="tab" aria-label="Tab Evaluation" role="tab" defaultChecked />
				Evaluation
			</label>
			<div class="tab-content border-base-content/20">
				<EvaluationPanel />
			</div>

			<label class="tab [--tab-border-color:var(--color-base-content)]/20">
				<input type="radio" name="tab" aria-label="Tab Chat" role="tab" />
				Chat
			</label>
			<div class="tab-content border-base-content/20">
				<ChatPanel />
			</div>
		</div>
	</aside>
</main>
