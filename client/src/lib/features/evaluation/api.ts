import { env } from "$env/dynamic/public";
import { task2EvaluationRequestSchema, type Task2EvaluationRequest } from "ielts-shared/schemas";
import z from "zod";

export class EvaluationApi {
	#abortController = new AbortController();

	send = async (request: Task2EvaluationRequest): Promise<ReadableStream<string>> => {
		this.abort();

		const validRequest = z.parse(task2EvaluationRequestSchema, request);

		const response = await fetch(env.PUBLIC_API_URL + "/task2/evaluate", {
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
