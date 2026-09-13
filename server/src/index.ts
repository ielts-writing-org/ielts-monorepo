import { inferdiHono } from "@inferdi/hono";
import { getMigrations } from "better-auth/db/migration";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { auth } from "./features/auth/auth";
import { sessionMiddleware } from "./features/auth/session-middleware";
import { handleOpenAPIRoute } from "./features/openapi/openapi";
import { handleScalarRoute } from "./features/scalar/scalar";
import { task2Endpoint } from "./features/task2";
import { factory } from "./shared/app-env";
import { buildRootContainer } from "./shared/container";
import { toErrorResponse } from "./shared/errors";

const root = buildRootContainer();
const app = factory.createApp();

app.onError((error, c) => {
	const { status, body } = toErrorResponse(error);
	return c.json(body, status as ContentfulStatusCode);
});

app.use(
	"*",
	cors({
		origin: "http://localhost:5173",
		credentials: true
	})
);
app.use("*", inferdiHono({ container: root }));
app.use(sessionMiddleware);

app.get("/", (c) => c.json({ status: "ok" }));

if (process.env.NODE_ENV === "development") {
	app.get("/openapi", handleOpenAPIRoute(app));
	app.get("/scalar", handleScalarRoute());

	// Protect or remove this endpoint in production
	app.post("/migrate", async (c) => {
		try {
			const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(auth.options);
			if (toBeCreated.length === 0 && toBeAdded.length === 0) {
				return c.json({ message: "No migrations needed" });
			}
			await runMigrations();
			return c.json({
				message: "Migrations completed successfully",
				created: toBeCreated.map((t) => t.table),
				added: toBeAdded.map((t) => t.table)
			});
		} catch (error) {
			return c.json({ error: error instanceof Error ? error.message : "Migration failed" }, 500);
		}
	});
}

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/task2", task2Endpoint);

export default app;
