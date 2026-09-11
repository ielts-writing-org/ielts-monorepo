import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

const PAGE_TITLE = ["IELTS WRITING TASK 1", "IELTS WRITING TASK 2"] as const;
const PAGE_SUBTITLE = [
	"Write an essay on the given diagram",
	"Write an essay on the given topic"
] as const;

export const load = (async ({ params }) => {
	const { taskId } = params;
	const taskIdNumber = parseInt(taskId) - 1;

	if (taskIdNumber > PAGE_TITLE.length) {
		error(400, { message: "Task Id not found" });
	}

	const pageTitle = PAGE_TITLE[taskIdNumber];
	const pageSubtitle = PAGE_SUBTITLE[taskIdNumber];
	return {
		taskId: taskIdNumber,
		pageTitle,
		pageSubtitle
	};
}) satisfies PageServerLoad;
