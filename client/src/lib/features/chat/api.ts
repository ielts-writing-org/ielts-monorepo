import { env } from "$env/dynamic/public";
import { ChatRequestSchema, type ChatRequest } from "ielts-shared/schemas/chat-request";
import z from "zod";

export class ChatApi {
	#abortController = new AbortController();

	send = async (request: ChatRequest): Promise<ReadableStream<string>> => {
		this.abort();

		const validRequest = z.parse(ChatRequestSchema, request);

		const response = await fetch(
			`${env.PUBLIC_SERVER_URL}/api/chat/${request.chatContext.context.taskId}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(validRequest),
				signal: this.#abortController.signal
			}
		);

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
