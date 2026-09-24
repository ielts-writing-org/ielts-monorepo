import { Hono } from "hono";
import { validator } from "hono-openapi";
import { EvaluateRequestSchema } from "../../schemas/evaluate-request";
import type { AppEnv } from "@/index";
import { validateTaskParam } from "@/middlewares/validate-task-param";
import { withBetterAuth } from "@/middlewares/with-auth";

export const evaluationRoute = new Hono<AppEnv>();

evaluationRoute.post(
	"/:taskId",
	...withBetterAuth({
		tags: ["Evaluation"],
		description: "Evaluate a writing submission based on 4 criteria",
		responses: {
			200: {
				description: "OK",
				content: {
					"text/event-stream": { schema: { type: "object" } }
				}
			}
		}
	}),
	validator("form", EvaluateRequestSchema),
	validateTaskParam,
	async (c) => {
		const request = c.req.valid("form");
		const service = c.var.di.get("evaluationService");
		const stream = await service.evaluate(request, c.req.raw.signal);
		return c.body(stream, 200, { "Content-Type": "text/event-stream" });
	}
);
