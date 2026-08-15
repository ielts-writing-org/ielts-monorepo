import type { ChatRequest } from '@ielts/shared';

export type ChatCommand = (
	| Exclude<ChatRequest[number], { type: 'context' }>
	| (Extract<ChatRequest[number], { type: 'context' }> & {
			deterministic: { words: number; characters: number; sentences: number; paragraphs: number };
	  })
)[];
export interface ChatClient {
	ask(command: ChatCommand, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
}
