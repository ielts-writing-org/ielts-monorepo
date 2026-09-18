import { describeRoute, validator } from "hono-openapi";
import { EvaluationRequestSchema } from "ielts-shared/schemas/evaluation-request";
import appFactory from "@/app-factory";
import { validateTask } from "@/middlewares/validate-task";

const evaluationRoute = appFactory.createApp();

evaluationRoute.post(
	"/:taskId",
	describeRoute({
		tags: ["Evaluation"],
		summary: "Evaluate a writing submission",
		description: "Evaluate a writing submission based on 4 criteria",
		responses: {
			200: {
				description: "SSE Stream",
				content: {
					"text/event-stream": {
						schema: {
							type: "object"
						}
					}
				}
			}
		}
	}),
	validator("json", EvaluationRequestSchema),
	validateTask,
	async (c) => {
		const requestJson = c.req.valid("json");
		const taskId = c.req.param("taskId");

		await using scope = c.var.di.createScope({
			ai: c.env.AI,
			task1KvNamespace: c.env.TASK1_KV,
			task2KvNamespace: c.env.TASK2_KV
		});
		const service = scope.get("evaluationService");

		const stream = await service.evaluate(
			{
				...requestJson,
				taskId: Number(taskId) as 1 | 2
			},
			c.req.raw.signal
		);

		return c.body(stream, 200, { "Content-Type": "text/event-stream" });
	}
);

export default evaluationRoute;
