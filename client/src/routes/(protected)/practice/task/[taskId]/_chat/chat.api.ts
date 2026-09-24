import { env } from "$env/dynamic/public";
import { EventSourceParserStream, type EventSourceMessage } from "eventsource-parser/stream";
import { type ChatRequest } from "ielts-server/schemas/chat-request";

export class ChatApi {
	private abortController: AbortController | undefined;

	chat = async (request: ChatRequest): Promise<ReadableStream<string>> => {
		this.abort();

		const abortController = new AbortController();
		this.abortController = abortController;

		const response = await fetch(`${env.PUBLIC_SERVER_URL}/api/chat/${request.taskContext.id}`, {
			method: "POST",
			body: this.createFormData(request),
			credentials: "include",
			signal: abortController.signal
		});

		if (!response.ok || !response.body) {
			throw new Error(`${response.statusText} (${response.status})`);
		}

		return response.body
			.pipeThrough(new TextDecoderStream())
			.pipeThrough(new EventSourceParserStream())
			.pipeThrough(
				new TransformStream<EventSourceMessage>({
					transform(chunk, controller) {
						if (chunk.data === "[DONE]") return;

						try {
							const json = JSON.parse(chunk.data);
							// TODO: Make this into openapi-compatible structured json
							const content = json.choices?.[0]?.delta?.content;
							if (content) {
								controller.enqueue(content);
							}
						} catch {
							// Ignore non-JSON control signals or ping events
						}
					}
				})
			);
	};

	abort = () => {
		this.abortController?.abort();
		this.abortController = undefined;
	};

	private createFormData = (request: ChatRequest): FormData => {
		const { taskContext, ...rest } = request;

		let taskImage: File | undefined;
		let contextWithoutImage = taskContext;

		if (taskContext.id === "1") {
			const { image, ...rest } = taskContext;
			taskImage = image;
			contextWithoutImage = rest;
		}

		const form = new FormData();
		form.append("data", JSON.stringify({ ...rest, taskContext: contextWithoutImage }));
		if (taskImage) {
			form.append("taskImage", taskImage);
		}

		return form;
	};
}
