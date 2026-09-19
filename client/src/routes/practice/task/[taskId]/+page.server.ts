import { error } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

type TaskContext =
	| {
			taskId: 1;
			task: string;
			response: string;
	  }
	| {
			taskId: 2;
			task: string;
			response: string;
	  };

const PAGE_TITLE = ["IELTS WRITING TASK 1", "IELTS WRITING TASK 2"] as const;
const PAGE_SUBTITLE = [
	"Write an essay on the given diagram",
	"Write an essay on the given topic"
] as const;
const INITIAL_TASKS: TaskContext[] = [
	{
		taskId: 1,
		task: "",
		response: ""
	},
	{
		taskId: 1,
		task: `<p class="font-semibold">
						The graph below gives information about the percentage of the population in four Asian
						countries living in cities from 1970 to 2020, with predictions for 2030 and 2040.
					</p>
					<p>
						Summarize the information by selecting and reporting the main features and making
						comparisons where relevant.
					</p>
					<img
						src="https://images.ctfassets.net/unrdeg6se4ke/23ckV7hT1zxlx46GXv4ij3/bf9421e0bd6faa49af91326e6c5d23c3/Bar-Chart-Model.jpg?&fm=avif&w=1220"
						alt="Bar chart"
						width="650px" />`,
		response: ""
	},
	{
		taskId: 2,
		task: "",
		response: ""
	}
];

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
		topic: INITIAL_TASKS[taskIdNumber].task,
		response: INITIAL_TASKS[taskIdNumber].response
	};
}) satisfies PageServerLoad;
