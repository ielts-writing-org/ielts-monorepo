import { auth } from "./auth";
import appFactory from "@/app-factory";

export const sessionMiddleware = appFactory.createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers
	});
	c.set("session", session?.session);
	c.set("user", session?.user);

	await next();
});
