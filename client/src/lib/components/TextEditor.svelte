<script lang="ts">
	import { HarperLinter } from "$lib/features/lint/harper-linter";
	import {
		calculateLintRects,
		type EditorLint,
		getLintStyle,
		type RenderedLint,
		toEditorLint
	} from "$lib/features/lint/lint-utils";
	import { debounce } from "$lib/utils/debounce";
	import { computeDeterministicStats } from "ielts-shared";
	import { onMount, type Snippet } from "svelte";

	type TextEditorProps = {
		class?: string;
		enableLinting?: boolean;
		enableStatistics?: boolean;
		icon?: Snippet;
		title?: string;
		value: string;
	};

	let {
		class: classNames = "",
		enableLinting = true,
		enableStatistics = true,
		icon,
		title,
		value = $bindable("")
	}: TextEditorProps = $props();

	let editor = $state<HTMLDivElement>();
	let overlay = $state<HTMLDivElement>();
	let stats = $derived(computeDeterministicStats(value));
	let editorLints = $state<EditorLint[]>([]);
	let renderedLints = $state<RenderedLint[]>([]);

	function relayout(): void {
		if (!editor || !overlay) return;
		renderedLints = calculateLintRects(editor, overlay, editorLints);
	}

	const scheduledLint = debounce(async () => {
		let lints = await HarperLinter.lint(value);
		editorLints = lints.map(toEditorLint);
		relayout();
	}, 150);

	const handleResponseTextChange = async () => {
		if (enableLinting) {
			scheduledLint.cancel();
			await scheduledLint();
		}
	};

	onMount(() => {
		const disposeFunctions: Array<() => void> = [];

		if (enableLinting) {
			const resizeObserver = new ResizeObserver(relayout);
			resizeObserver.observe(editor!);
			disposeFunctions.push(resizeObserver.disconnect);

			scheduledLint();
			disposeFunctions.push(scheduledLint.cancel);
		}

		return () => disposeFunctions.forEach((f) => f());
	});
</script>

<div class={["flex flex-col rounded-md border border-base-content/20 bg-base-100", classNames]}>
	<div class="prose flex max-w-none flex-1 flex-col gap-2 p-2">
		<!-- Editor Header -->
		{#if title}
			<div class="flex items-center justify-between">
				<div>
					{@render icon?.()}
					<p class="inline font-bold text-primary uppercase">{title}</p>
				</div>
				{#if enableStatistics}
					<div class="text-sm">{stats.characters}/250 character</div>
				{/if}
			</div>
		{/if}

		<!-- Editor wrapper -->
		<div class="relative flex-1">
			<!-- Editor -->
			<div
				class="textarea h-full w-full border-none"
				spellcheck="false"
				contenteditable="plaintext-only"
				oninput={handleResponseTextChange}
				bind:this={editor}
				bind:innerText={value}>
			</div>
			<!-- Lint overlay -->
			{#if enableLinting}
				<div
					class="pointer-events-none absolute inset-0 textarea h-full w-full border-none bg-transparent"
					aria-hidden="true"
					bind:this={overlay}>
					{#each renderedLints as rendered (rendered.lint.id)}
						{#each rendered.rects as rect, i (i)}
							<div
								style:--lint-x={rect.x + "px"}
								style:--lint-y={rect.y + rect.height - 2 + "px"}
								style:--lint-width={rect.width + "px"}
								class={[
									"pointer-events-none absolute top-(--lint-y) left-(--lint-x) h-px w-(--lint-width) underline decoration-wavy",
									getLintStyle(rendered.lint.kind) === "spelling" && "bg-red-600",
									getLintStyle(rendered.lint.kind) === "grammar" && "bg-red-600",
									getLintStyle(rendered.lint.kind) === "punctuation" && "bg-yellow-600",
									getLintStyle(rendered.lint.kind) === "style" && "bg-blue-600",
									getLintStyle(rendered.lint.kind) === "other" && "bg-gray-600"
								]}>
								<!-- {rendered.lint.source.get_problem_text()} -->
							</div>
						{/each}
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Editor Footer / Statistics -->
	{#if enableStatistics}
		<div class="flex flex-wrap gap-x-4 gap-y-2 rounded-b-lg bg-base-300 p-2 text-sm font-semibold">
			<p>Paragraphs: {stats.paragraphs}</p>
			<p>Sentences: {stats.sentences}</p>
			<p>Characters: {stats.characters}</p>
			<p>Avg. Sentence Length: {stats.averageSentenceLength.toFixed(0)} words</p>
		</div>
	{/if}
</div>
