<script lang="ts">
	import TextEditor from "$lib/components/TextEditor.svelte";
	import { setTaskContext, type TaskContext } from "$lib/contexts/task-context";
	import ChatPanel from "$lib/features/chat/ChatPanel.svelte";
	import EvaluationPanel from "$lib/features/evaluate/EvaluationPanel.svelte";
	import { Lightbulb, Pilcrow } from "@lucide/svelte";

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
</script>

<svelte:head>
	<title>Task 2 | IELTS Writing</title>
	<meta name="description" content="IELTS Writing Task 2" />
</svelte:head>

<main class="flex flex-col gap-4 p-2 md:flex-row">
	<section class="flex flex-1 flex-col gap-4 xl:flex-2">
		<TextEditor
			title="Writing task 2 topic"
			bind:value={taskContext.task_2.topic}
			enableStatistics={false}>
			{#snippet icon()}
				<Lightbulb size="1em" class="inline text-primary" />
			{/snippet}
		</TextEditor>

		<TextEditor class="flex-1" title="Essay workspace" bind:value={taskContext.task_2.response}>
			{#snippet icon()}
				<Pilcrow size="1em" class="inline align-text-bottom text-primary" />
			{/snippet}
		</TextEditor>
	</section>

	<aside class="sticky top-[10.5%] flex h-[calc(100dvh-6rem)] flex-1 flex-col gap-4 xl:top-[9.5%]">
		<EvaluationPanel taskContext={{ ...taskContext.task_2 }} />
		<ChatPanel taskContext={{ ...taskContext.task_2 }} />
	</aside>
</main>
