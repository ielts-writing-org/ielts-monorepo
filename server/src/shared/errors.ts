import { ZodError } from 'zod';

export class AppError extends Error {
	readonly status: number;
	readonly code: string;

	constructor(message: string, options: { status: number; code: string; cause?: unknown }) {
		super(message, { cause: options.cause });
		this.name = new.target.name;
		this.status = options.status;
		this.code = options.code;
	}
}

export class ConfigError extends AppError {
	constructor(message: string, cause?: unknown) {
		super(message, { status: 503, code: 'config_error', cause });
	}
}

export interface ErrorResponse {
	status: number;
	body: Record<string, unknown>;
}

export function toErrorResponse(error: unknown): ErrorResponse {
	if (error instanceof AppError) {
		return {
			status: error.status,
			body: { error: error.code, message: error.message }
		};
	}

	if (error instanceof ZodError) {
		const issues = error.issues.map((issue) => ({
			path: issue.path.join('.'),
			message: issue.message
		}));
		return {
			status: 400,
			body: {
				error: 'validation_error',
				message: 'Request body validation failed.',
				issues
			}
		};
	}

	console.error(
		JSON.stringify({
			level: 'error',
			message: 'Unhandled error',
			...serializeError(error)
		})
	);
	return {
		status: 500,
		body: { error: 'internal_error', message: 'Unexpected server error.' }
	};
}

function serializeError(error: unknown): Record<string, unknown> {
	if (error instanceof Error) {
		return { name: error.name, errorMessage: error.message };
	}
	return { value: String(error) };
}
