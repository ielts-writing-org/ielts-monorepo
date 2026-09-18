import { env } from "$env/dynamic/public";
import {
	EvaluationRequestSchema,
	type EvaluationRequest
} from "ielts-shared/schemas/evaluation-request";

import z from "zod";

export class EvaluationApi {
	#abortController = new AbortController();

	send = async (request: EvaluationRequest, taskId: number): Promise<ReadableStream<string>> => {
		this.abort();

		const validRequest = z.parse(EvaluationRequestSchema, request);

		const response = await fetch(`${env.PUBLIC_SERVER_URL}/api/evaluation/${taskId}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(validRequest),
			signal: this.#abortController.signal
		});

		if (
			!response.ok ||
			!response.body ||
			response.headers.get("content-type") !== "text/event-stream"
		) {
			throw new Error(
				`Unexpected response from evaluation API: ${response.status} ${response.statusText}`
			);
		}

		return response.body.pipeThrough(new TextDecoderStream());
	};

	abort = () => {
		this.#abortController.abort();
		this.#abortController = new AbortController();
	};
}
