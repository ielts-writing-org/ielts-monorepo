import type { InferdiHonoScopeEnv } from "@inferdi/hono";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { inferdi } from "./container";
import type { RequestScope } from "./container";
import { createOpenAPIHandler } from "./openapi.handler";
import { createScalarHandler } from "./scalar.handler";
import type { auth } from "@/auth";
import { authRoute } from "@/features/auth/auth.route";
import { chatRoute } from "@/features/chat/chat.route";
import { evaluationRoute } from "@/features/evaluation/evaluation.route";

export type AppEnv = {
	Bindings: CloudflareBindings;
	Variables: {
		session: typeof auth.$Infer.Session | null;
	};
} & InferdiHonoScopeEnv<RequestScope>;

const app = new Hono<AppEnv>();
app.use(logger());
app.use(
	"*",
	cors({
		origin: (process.env.CORS_ORIGINS || "").split(","),
		credentials: true
	})
);
app.use("*", inferdi);

app.use(
	"/:path{(api/openapi|scalar)}",
	basicAuth({ username: "admin", password: process.env.BETTER_AUTH_API_KEY })
);
app.get("/api/openapi", createOpenAPIHandler(app));
app.get("/scalar", createScalarHandler());

app.get("/:path{(api/health)?}", (c) => c.json({ status: "ok" }));

app.route("/", authRoute);
app.route("/api/evaluation", evaluationRoute);
app.route("/api/chat", chatRoute);

export default app;
