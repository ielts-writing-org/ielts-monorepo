import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type TaskContext =
	| {
			taskId: 1;
			topic: string;
			response: string;
	  }
	| {
			taskId: 2;
			image: string;
			response: string;
	  };

const PAGE_TITLE = ["IELTS WRITING TASK 1", "IELTS WRITING TASK 2"] as const;
const PAGE_SUBTITLE = [
	"Write an essay on the given diagram",
	"Write an essay on the given topic"
] as const;
const INITIAL_TASKS: TaskContext = {
	taskId: 1,
	topic:
		"Should unpaid community service be compulsory in high school? (Work for charities, neighbourhood improvement, sports mentoring). Discuss both views and give your opinion.",
	response: `In recent years, whether high school students should be required to participate in unpaid community work has sparked widespread debate. While some argue that academic focus should remain the sole priority, I firmly agree that mandatory voluntary programmes cultivate crucial civic values, develop practical teamwork abilities, and foster empathy among adolescents.
First and foremost, engaging in community initiatives exposes adolescents to real-world societal challenges outside the classroom. By assisting local charities, cleaning public parks, or mentoring younger children, pupils gain firsthand awareness of social inequality and civic responsibility.`
};

export const load = (async ({ params }) => {
	const { taskId } = params;
	const taskIdNumber = parseInt(taskId);

	if (taskIdNumber > PAGE_TITLE.length) {
		error(400, { message: "Task Id not found" });
	}

	const pageTitle = PAGE_TITLE[taskIdNumber - 1];
	const pageSubtitle = PAGE_SUBTITLE[taskIdNumber - 1];
	return {
		taskId: taskIdNumber,
		pageTitle,
		pageSubtitle,
		topic: INITIAL_TASKS.topic,
		response: INITIAL_TASKS.response
	};
}) satisfies PageServerLoad;
