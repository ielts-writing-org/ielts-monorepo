<script lang="ts">
	import { resolve } from "$app/paths";
	import { ArrowLeft, ArrowRight } from "@lucide/svelte";
	import ErrorModal from "./_components/ErrorModal.svelte";
	import ThemeToggle from "./_components/ThemeToggle.svelte";
	import { setHandlerContext } from "./_contexts/handler-context";
	import { setTaskContext, type TaskContext } from "./_contexts/task-context";
	import { Task2ChatHandler } from "./_handlers/task2-chat-handler.svelte";
	import { Task2EvaluationHandler } from "./_handlers/task2-evaluation-handler.svelte";

	let { children } = $props();

	let errorModal = $state<HTMLDialogElement | undefined>(undefined);
	let errorModalMessage = $state<string | undefined>(undefined);

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

	const task2Evaluation = new Task2EvaluationHandler();
	task2Evaluation.onError = (errorMessage) => {
		errorModalMessage = errorMessage;
		errorModal?.showModal();
	};

	const task2Chat = new Task2ChatHandler();
	setHandlerContext({
		task2EvaluationHandler: task2Evaluation,
		task2ChatHandler: task2Chat
	});

	const handleEvaluate = () => {
		task2Evaluation.run(taskContext.task_2.topic, taskContext.task_2.response);
	};
</script>

<header class="navbar sticky top-0 z-50 mb-2 bg-base-200 shadow">
	<div class="navbar-start lg:gap-4">
		<a href={resolve("/")} class="btn btn-sm not-lg:btn-ghost lg:btn-md">
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
		<button
			class="group btn btn-primary"
			onclick={handleEvaluate}
			disabled={task2Evaluation.isEvaluating}>
			<span class="loading loading-spinner not-group-disabled:hidden"></span>
			Evaluate
			<ArrowRight size="1em" />
		</button>
	</div>
</header>

<ErrorModal bind:modal={errorModal} errorMessage={errorModalMessage} />

{@render children()}
