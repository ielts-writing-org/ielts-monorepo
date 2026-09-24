import type { ChatMessage } from "@/schemas/chat-message";
import type { EvaluateResponse } from "@/schemas/evaluate-response";

interface TaskStats {
	words: number;
	characters: number;
	sentences: number;
	paragraphs: number;
}

export interface ChatRequest {
	taskContext: {
		id: "1" | "2";
		prompt?: string | undefined;
		response?: string | undefined;
		image?: string;
		stats: TaskStats;
	};
	messages: ChatMessage[];
	evaluationResponse?: EvaluateResponse;
}

export interface EvaluateRequest {
	id: "1" | "2";
	prompt: string | undefined;
	response: string | undefined;
	image?: string;
	stats: TaskStats;
}

export interface AiClient {
	chat(request: ChatRequest, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
	evaluate(request: EvaluateRequest, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
}
