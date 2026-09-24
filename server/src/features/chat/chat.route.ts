import { Hono } from "hono";
import { validator } from "hono-openapi";
import { ChatFormRequestSchema } from "./chat-form-request";
import type { AppEnv } from "@/index";
import { validateTaskParam } from "@/middlewares/validate-task-param";
import { withBetterAuth } from "@/middlewares/with-auth";

export const chatRoute = new Hono<AppEnv>();

chatRoute.post(
	"/:taskId",
	...withBetterAuth({
		tags: ["Chat"],
		description: "Send a message to the AI assistant and receive a response",
		responses: {
			200: {
				description: "OK",
				content: {
					"text/event-stream": { schema: { type: "object" } }
				}
			}
		}
	}),
	validator("form", ChatFormRequestSchema),
	validateTaskParam,
	async (c) => {
		const request = c.req.valid("form");
		const chatService = c.var.di.get("chatService");
		const stream = await chatService.chat(request, c.req.raw.signal);
		return c.body(stream, 200, { "Content-Type": "text/event-stream" });
	}
);
