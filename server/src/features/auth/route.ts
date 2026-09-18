import { getMigrations } from "better-auth/db/migration";
import { auth } from "./auth";
import { sessionMiddleware } from "./session-middleware";
import appFactory from "@/app-factory";

const authRoute = appFactory.createApp();

authRoute.use(sessionMiddleware);

if (process.env.NODE_ENV === "development") {
	// TODO: Protect or remove this endpoint in production
	authRoute.post("/api/auth/migrate", async (c) => {
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

authRoute.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

export default authRoute;
