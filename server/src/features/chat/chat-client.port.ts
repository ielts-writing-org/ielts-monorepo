import type * as types from "ielts-shared/schemas/chat-request";

export interface ChatRequest {
	chatContext: types.ChatContextRequest & {
		deterministic: { words: number; characters: number; sentences: number; paragraphs: number };
	};
	evaluation?: types.ChatRequest["evaluation"];
	chatHistory: types.ChatContentRequest[];
}
export default interface ChatClient {
	chat(request: ChatRequest, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
}
