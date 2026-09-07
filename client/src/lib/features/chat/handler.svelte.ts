import { EventSourceParserStream } from "eventsource-parser/stream";
import { HandlerExecutionError } from "./error";
import type { ChatMessage } from "ielts-shared";
import { ChatApi } from "./api";

export type ChatContext = ChatMessage[];

export class ChatHandler {
	isExecuting = $state(false);
	errorMessage = $state<string | undefined>();
	response = $state<string | undefined>();
	onEnd: (() => void) | undefined;

	isSuccess = $derived(!this.errorMessage);

	#api = new ChatApi();

	async execute(chatContext: ChatContext) {
		if (this.isExecuting) {
			throw new HandlerExecutionError("Another execution is running on this handler");
		}

		try {
			this.isExecuting = true;
			this.errorMessage = undefined;
			this.response = undefined;

			const stream = await this.#api.send(chatContext);
			const reader = stream.pipeThrough(new EventSourceParserStream()).getReader();

			this.response = "";
			while (true) {
				const { done, value } = await reader.read();
				if (done || value?.data === "[DONE]") break;
				const json = JSON.parse(value.data);
				this.response += json.choices?.[0]?.delta?.content ?? "";
			}
		} catch (e) {
			this.errorMessage = e instanceof Error ? e.message : String(e);
		} finally {
			this.isExecuting = false;
			this.onEnd?.();
		}
	}
}
