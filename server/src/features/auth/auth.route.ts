import { getMigrations } from "better-auth/db/migration";
import { Hono } from "hono";
import { resolver } from "hono-openapi";
import { z } from "zod";
import type { MigrationResponse } from "./migration-response.schema";
import { MigrationResponseSchema } from "./migration-response.schema";
import { auth } from "@/auth";
import type { AppEnv } from "@/index";
import { withBearerAuth } from "@/middlewares/with-auth";

export const authRoute = new Hono<AppEnv>();

authRoute.post(
	"/api/auth/migrate",
	...withBearerAuth({
		tags: ["Auth"],
		description: "Send a message to the AI assistant and receive a response",
		responses: {
			200: {
				description: "OK",
				content: {
					"application/json": { schema: resolver(MigrationResponseSchema) }
				}
			},
			500: {
				description: "Internal Server Error",
				content: {
					"plain/text": { schema: resolver(z.string()) }
				}
			}
		}
	}),
	async (c) => {
		const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
		if (toBeCreated.length === 0 && toBeAdded.length === 0) {
			return c.json<MigrationResponse>({ message: "No migrations needed" });
		}
		await runMigrations();
		return c.json<MigrationResponse>({
			message: "Migrations completed successfully",
			created: toBeCreated.map((t) => t.table),
			added: toBeAdded.map((t) => t.table)
		});
	}
);

authRoute.all("/api/auth/*", (c) => auth.handler(c.req.raw));
