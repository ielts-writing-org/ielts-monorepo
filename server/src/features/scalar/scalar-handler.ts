import { Scalar } from "@scalar/hono-api-reference";

const scalarHandler = () =>
	Scalar({
		url: "/openapi",
		pageTitle: "IELTS Writing Scalar API Reference"
	});

export default scalarHandler;
