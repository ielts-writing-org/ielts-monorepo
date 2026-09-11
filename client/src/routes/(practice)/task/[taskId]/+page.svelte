<script lang="ts">
	import ChatPanel from "$lib/features/chat/ChatPanel.svelte";
	import EvaluationPanel from "$lib/features/evaluation/EvaluationPanel.svelte";
	import Editor from "$lib/features/harper/harper-editor/Editor.svelte";
	import { setTaskContext, type TaskContext } from "$lib/shared/task-context";
	import { Lightbulb, Pilcrow } from "@lucide/svelte";
	import { LocalLinter } from "harper.js";
	import { binary } from "harper.js/binary";
	import { onMount } from "svelte";

	const { data } = $props();

	const INITIAL_TASKS: TaskContext = {
		task_2: {
			topic:
				"Should unpaid community service be compulsory in high school? (Work for charities, neighbourhood improvement, sports mentoring). Discuss both views and give your opinion.",
			response: `In recent years, whether high school students should be required to participate in unpaid community work has sparked widespread debate. While some argue that academic focus should remain the sole priority, I firmly agree that mandatory voluntary programmes cultivate crucial civic values, develop practical teamwork abilities, and foster empathy among adolescents.
First and foremost, engaging in community initiatives exposes adolescents to real-world societal challenges outside the classroom. By assisting local charities, cleaning public parks, or mentoring younger children, pupils gain firsthand awareness of social inequality and civic responsibility.`
		}
	};
	const taskContext = $state<TaskContext>(INITIAL_TASKS);
	setTaskContext(taskContext);

	let linter = $state<LocalLinter>();

	onMount(() => {
		linter = new LocalLinter({ binary });
	});
</script>

<svelte:head>
	<title>Task {data.taskId} | IELTS Writing</title>
	<meta name="description" content={data.pageTitle} />
</svelte:head>

<main class="flex flex-col gap-4 p-2 md:flex-row">
	<section class="flex flex-1 flex-col gap-4 xl:flex-2">
		<div class="flex flex-col rounded-md border border-base-content/20 bg-base-100">
			<div class="prose flex max-w-none flex-1 flex-col gap-2 p-2">
				<div>
					<Lightbulb size="1em" class="inline text-primary" />
					<p class="inline font-bold text-primary uppercase">Your response</p>
				</div>
			</div>
			<Editor linter={linter!} bind:content={taskContext.task_2.topic} />
		</div>

		<div class="flex flex-col rounded-md border border-base-content/20 bg-base-100">
			<div class="prose flex max-w-none flex-1 flex-col gap-2 p-2">
				<div>
					<Pilcrow size="1em" class="inline align-text-bottom text-primary" />
					<p class="inline font-bold text-primary uppercase">Your response</p>
				</div>
			</div>
			<Editor linter={linter!} bind:content={taskContext.task_2.response} />
		</div>
	</section>

	<aside class="sticky top-[10.5%] flex h-[calc(100dvh-6rem)] flex-1 flex-col gap-4 xl:top-[9.5%]">
		<EvaluationPanel taskContext={{ ...taskContext.task_2 }} />
		<ChatPanel taskContext={{ ...taskContext.task_2 }} />
	</aside>
</main>
