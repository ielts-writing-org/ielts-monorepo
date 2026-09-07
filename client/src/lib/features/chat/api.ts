import { env } from "$env/dynamic/public";
import { chatRequestSchema, type ChatRequest } from "ielts-shared";
import z from "zod";

export class ChatApi {
	#abortController = new AbortController();

	send = async (request: ChatRequest): Promise<ReadableStream<string>> => {
		this.abort();

		const validRequest = z.parse(chatRequestSchema, request);

		const response = await fetch(env.PUBLIC_API_URL + "/task2/chat", {
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
				`Unexpected response from chat API: ${response.status} ${response.statusText}`
			);
		}

		return response.body.pipeThrough(new TextDecoderStream());
	};

	abort = () => {
		this.#abortController.abort();
		this.#abortController = new AbortController();
	};
}
