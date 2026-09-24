import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { isValidTaskId } from "ielts-server/utils/validation";
import type { TaskContext } from "ielts-server/schemas/task-context";

const PAGE_TITLE = ["TASK 1", "TASK 2"] as const;
const PAGE_SUBTITLE = [
	"Write an essay on the given diagram",
	"Write an essay on the given topic"
] as const;

// TODO: Load task saved
const INITIAL_TASKS = [
	{
		id: "1",
		prompt: "",
		response: ""
	},
	{
		id: "2",
		prompt: "",
		response: ""
	}
] as const satisfies TaskContext[];

export const load = (async ({ params }) => {
	const { taskId } = params;

	if (!isValidTaskId(taskId)) {
		error(400, { message: "Invalid task id" });
	}

	const taskIdNumber = parseInt(taskId);

	return {
		pageTitle: PAGE_TITLE[taskIdNumber - 1],
		pageSubtitle: PAGE_SUBTITLE[taskIdNumber - 1],
		task: INITIAL_TASKS[taskIdNumber - 1]
	};
}) satisfies PageServerLoad;
