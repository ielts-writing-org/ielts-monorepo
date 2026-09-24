import { bearerAuth } from "hono/bearer-auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { describeRoute, resolver } from "hono-openapi";
import { z } from "zod";
import { auth } from "@/auth";

const Unauthorized = z.string().meta({ id: "Unauthorized" });

type RouteSpec = Parameters<typeof describeRoute>[0];

function addBetterAuthSpecs(spec: Partial<RouteSpec> = {}) {
	return describeRoute({
		...spec,
		security: [{ CookieAuth: [] }],
		responses: {
			401: {
				description: "Unauthorized",
				content: {
					"plain/text": { schema: resolver(Unauthorized) }
				}
			},
			...spec.responses
		}
	});
}

const loadBetterAuthSession = createMiddleware(async (c, next) => {
	const session = await auth.api.getSession({
		headers: c.req.raw.headers
	});
	c.set("session", session);

	await next();
});

const requireBetterAuth = createMiddleware(async (c, next) => {
	if (!c.get("session")) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	await next();
});

export function withBetterAuth(spec: Partial<RouteSpec> = {}) {
	return [addBetterAuthSpecs(spec), loadBetterAuthSession, requireBetterAuth] as const;
}

function addBearerSpecs(spec: Partial<RouteSpec> = {}) {
	return describeRoute({
		...spec,
		security: [{ BearerAuth: [] }],
		responses: {
			400: {
				description: "Bad Request",
				content: {
					"plain/text": { schema: resolver(z.string()) }
				}
			},
			401: {
				description: "Unauthorized",
				content: {
					"plain/text": { schema: resolver(Unauthorized) }
				}
			},
			...spec.responses
		}
	});
}

export function withBearerAuth(spec: Partial<RouteSpec> = {}) {
	return [addBearerSpecs(spec), bearerAuth({ token: process.env.BETTER_AUTH_API_KEY })] as const;
}
