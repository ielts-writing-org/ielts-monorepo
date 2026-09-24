import { Scalar } from "@scalar/hono-api-reference";

export function createScalarHandler() {
	return Scalar({
		url: "/api/openapi",
		pageTitle: "IELTS Writing Scalar API Reference",
		sources: [
			{ url: "/api/openapi", title: "API" },
			{ url: "/api/auth/open-api/generate-schema", title: "Auth" }
		]
	});
}
