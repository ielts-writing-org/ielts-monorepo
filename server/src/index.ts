import { inferdiHono } from "@inferdi/hono";
import { cors } from "hono/cors";
import appFactory from "./app-factory";
import { buildRootContainer } from "./container";
import { toErrorResponse } from "./core/error-handling/errors";
import authRoute from "./features/auth/route";
import chatRoute from "./features/chat/route";
import evaluationRoute from "./features/evaluation/route";
import openAPIHandler from "./features/openapi/openapi-handler";
import scalarHandler from "./features/scalar/scalar-handler";

const root = buildRootContainer();
const app = appFactory.createApp();

app.onError((error, c) => {
	// TODO: Improve error handling
	const { status, body } = toErrorResponse(error);
	return c.json(body, status);
});

app.use(
	"*",
	cors({
		origin: process.env.CORS_ORIGINS.split(","),
		credentials: true
	})
);
app.use("*", inferdiHono({ container: root }));

app.get("/:path{(\api\/health)?}", (c) => c.json({ status: "ok" }));

app.route("/", authRoute);

if (process.env.NODE_ENV === "development") {
	app.get("/openapi", openAPIHandler(app));
	app.get("/scalar", scalarHandler());
}
app.route("/api/evaluation", evaluationRoute);
app.route("/api/chat", chatRoute);

export default app;
