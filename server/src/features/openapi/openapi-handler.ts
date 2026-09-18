import { toOpenAPISchema } from "@standard-community/standard-openapi";
import type { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import type { AppEnv } from "@/app-factory";
import { ValidationErrorResponseSchema } from "@/core/error-handling/errors";

const validationErrorResponseOpenAPISchema = await toOpenAPISchema(ValidationErrorResponseSchema);

const openAPIHandler = (app: Hono<AppEnv>) =>
	openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: "IELTS Writing APIs",
				version: "1.0.0",
				description: "API documentation for the IELTS Writing application",
				contact: {
					name: "IELTS Writing Support",
					email: "admin@ptus04.id.vn",
					url: "https://ielts-writing.ptus04.id.vn"
				},
				termsOfService: "https://ielts-writing.ptus04.id.vn/terms-of-service"
			},
			servers: [{ url: "http://localhost:8787", description: "Local Development Server" }],
			tags: [
				{
					name: "Chat",
					description: "Chat API"
				},
				{
					name: "Evaluation",
					description: "Evaluation API"
				}
			],
			components: {
				...validationErrorResponseOpenAPISchema.components
			}
		},
		defaultValidationErrorResponse: {
			description: "Validation error",
			content: {
				"application/json": {
					schema: validationErrorResponseOpenAPISchema.schema
				}
			}
		}
	});

export default openAPIHandler;
