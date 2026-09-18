import appFactory from "@/app-factory";

/**
 * Validate the followings:
 * 1. Validate the `taskId`: must be 1 or 2
 */
export const validateTask = appFactory.createMiddleware(async (c, next) => {
	const taskId = c.req.param("taskId");
	if (taskId !== "1" && taskId !== "2") {
		return c.notFound();
	}

	await next();
});
