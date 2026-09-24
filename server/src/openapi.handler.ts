import type { Hono, MiddlewareHandler } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import type { AppEnv } from "./app";

export function createOpenAPIHandler(app: Hono<AppEnv>): MiddlewareHandler {
	return openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: "IELTS Writing APIs",
				version: "1.0.0",
				description: "API Reference for the IELTS Writing application",
				contact: {
					url: "https://ielts-writing.ptus04.id.vn"
				}
			},
			servers: [
				{ url: "http://localhost:8787", description: "Local Development Server" },
				{ url: "https://ielts-writing.ptus04.id.vn", description: "Live Server" }
			],
			tags: [{ name: "Chat" }, { name: "Evaluation" }, { name: "Auth" }],
			components: {
				securitySchemes: {
					CookieAuth: {
						type: "apiKey",
						in: "cookie",
						name: "session_token"
					},
					BearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "apiKey"
					}
				}
			}
		}
	});
}
