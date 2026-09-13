import { auth } from "./auth";
import { factory } from "@/shared/app-env";

export const sessionMiddleware = factory.createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers
	});
	c.set("session", session?.session);
	c.set("user", session?.user);

	await next();
});
