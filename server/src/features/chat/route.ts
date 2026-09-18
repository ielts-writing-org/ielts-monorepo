import { describeRoute, validator } from "hono-openapi";
import { ChatRequestSchema } from "ielts-shared/schemas/chat-request";
import appFactory from "@/app-factory";
import { validateTask } from "@/middlewares/validate-task";

const chatRoute = appFactory.createApp();

chatRoute.post(
	"/:taskId",
	describeRoute({
		tags: ["Chat"],
		summary: "Chat with the AI assistant",
		description: "Send a message to the AI assistant and receive a response",
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
	validator("json", ChatRequestSchema),
	validateTask,
	async (c) => {
		const requestJson = c.req.valid("json");

		await using scope = c.var.di.createScope({
			ai: c.env.AI,
			task1KvNamespace: c.env.TASK1_KV,
			task2KvNamespace: c.env.TASK2_KV
		});
		const chatService = scope.get("chatService");

		const stream = await chatService.chat(requestJson, c.req.raw.signal);

		return c.body(stream, 200, { "Content-Type": "text/event-stream" });
	}
);

export default chatRoute;
