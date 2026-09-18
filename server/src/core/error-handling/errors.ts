import type { ContentfulStatusCode } from "hono/utils/http-status";
import z, { ZodError } from "zod";

export class AppError extends Error {
	readonly status: ContentfulStatusCode;
	readonly code: string;

	constructor(
		message: string,
		options: { status: ContentfulStatusCode; code: string; cause?: unknown }
	) {
		super(message, { cause: options.cause });
		this.name = new.target.name;
		this.status = options.status;
		this.code = options.code;
	}
}

export class ConfigError extends AppError {
	readonly status: ContentfulStatusCode = 503;
	readonly code: string = "config_error";
}

export interface ErrorResponse {
	status: ContentfulStatusCode;
	body: Record<string, unknown>;
}

export function toErrorResponse(error: unknown): ErrorResponse {
	// AppErrorResponseSchema
	if (error instanceof AppError) {
		return {
			status: error.status,
			body: { error: error.code, message: error.message }
		};
	}

	// ValidationErrorResponseSchema
	if (error instanceof ZodError) {
		const issues = error.issues.map((issue) => ({
			path: issue.path.join("."),
			message: issue.message
		}));
		return {
			status: 400,
			body: {
				error: "validation_error",
				message: "Request body validation failed.",
				issues
			}
		};
	}

	console.error(
		JSON.stringify({
			level: "error",
			message: "Unhandled error",
			...serializeError(error)
		})
	);

	// UnhandledErrorResponseSchema
	return {
		status: 500,
		body: { error: "internal_error", message: "Unexpected server error." }
	};
}

function serializeError(error: unknown): Record<string, unknown> {
	if (error instanceof Error) {
		return { name: error.name, errorMessage: error.message };
	}
	return { value: String(error) };
}

// ===================================================================== //
// ============================== SCHEMAS ============================== //
// ===================================================================== //
export const AppErrorResponseSchema = z
	.compile(
		z.object({
			status: z.custom<ContentfulStatusCode>(),
			body: z.record(z.string(), z.unknown())
		}) satisfies z.ZodType<ErrorResponse>
	)
	.meta({
		id: "AppErrorResponseSchema"
	});

export const ValidationErrorResponseSchema = z
	.compile(
		z.object({
			status: z.literal(400),
			body: z.object({
				error: z.string(),
				message: z.string(),
				issues: z.array(
					z.object({
						path: z.string(),
						message: z.string()
					})
				)
			})
		}) satisfies z.ZodType<ErrorResponse>
	)
	.meta({
		id: "ValidationErrorResponseSchema"
	});

export const UnhandledErrorResponseSchema = z
	.compile(
		z.object({
			status: z.literal(500),
			body: z.object({
				error: z.string(),
				message: z.string()
			})
		})
	)
	.meta({
		id: "UnhandledErrorResponseSchema"
	});
