import { createMiddleware } from "hono/factory";
import { isValidTaskId } from "@/utils/validation";

export const validateTaskParam = createMiddleware(async (c, next) => {
	const taskId = c.req.param("taskId");
	if (!taskId) {
		return c.notFound();
	}

	if (!isValidTaskId(taskId)) {
		return c.notFound();
	}

	await next();
});
