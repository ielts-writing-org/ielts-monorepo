<script lang="ts">
	import EvaluationErrorModal from './_components/EvaluationErrorModal.svelte';
	import TasksHeader from './_components/TasksHeader.svelte';
	import { setHandlerContext } from './_contexts/handler-context';
	import { setTaskContext, type TaskContext } from './_contexts/task-context';
	import { Task2ChatHandler } from './_handlers/task2-chat-handler.svelte';
	import { Task2EvaluationHandler } from './_handlers/task2-evaluation-handler.svelte';

	let { children } = $props();

	let evaluationErrorModal = $state<HTMLDialogElement | undefined>(undefined);
	let modalErrorMessage = $state<string | undefined>(undefined);

	const INITIAL_TASKS: TaskContext = {
		task_2: {
			topic:
				'Should unpaid community service be compulsory in high school? (Work for charities, neighbourhood improvement, sports mentoring). Discuss both views and give your opinion.',
			response: `In recent years, whether high school students should be required to participate in unpaid community work has sparked widespread debate. While some argue that academic focus should remain the sole priority, I firmly agree that mandatory voluntary programmes cultivate crucial civic values, develop practical teamwork abilities, and foster empathy among adolescents.
First and foremost, engaging in community initiatives exposes adolescents to real-world societal challenges outside the classroom. By assisting local charities, cleaning public parks, or mentoring younger children, pupils gain firsthand awareness of social inequality and civic responsibility.`
		}
	};
	const taskContext = $state<TaskContext>(INITIAL_TASKS);
	setTaskContext(taskContext);

	const task2Evaluation = new Task2EvaluationHandler();
	const task2Chat = new Task2ChatHandler();
	setHandlerContext({
		task2EvaluationHandler: task2Evaluation,
		task2ChatHandler: task2Chat
	});
</script>

<TasksHeader
	onEvaluate={() => task2Evaluation.run(taskContext.task_2.topic, taskContext.task_2.response)}
	isEvaluating={task2Evaluation.isEvaluating} />

<EvaluationErrorModal bind:modal={evaluationErrorModal} errorMessage={modalErrorMessage} />

{@render children()}
