import { EventSourceParserStream } from 'eventsource-parser/stream';
import { chatTask2 } from '../_apis/chat-api.svelte';
import type { ChatContext } from '../_contexts/chat-context';

export class Task2ChatHandler {
	result = $state<string | undefined>();
	isRunning = $state(false);
	error = $state<string | null>(null);
	onEnd: ((isSuccess: boolean) => void) | undefined = undefined;

	async run(chatContext: ChatContext) {
		try {
			this.isRunning = true;
			this.error = null;
			this.result = undefined;

			const stream = await chatTask2(chatContext);
			const reader = stream.pipeThrough(new EventSourceParserStream()).getReader();

			this.result = '';
			while (true) {
				const { done, value } = await reader.read();
				if (done || value?.data === '[DONE]') {
					break;
				}
				this.result += JSON.parse(value.data).choices?.[0]?.delta?.content ?? '';
			}
		} catch (e) {
			this.error = e instanceof Error ? e.message : String(e);
		} finally {
			this.isRunning = false;
			this.onEnd?.(this.error === null);
		}
	}
}
