import type * as types from "ielts-shared/schemas/evaluation-request";

type EvaluationRequest = {
	taskId: 1 | 2;
	deterministic: {
		words: number;
		sentences: number;
		characters: number;
		paragraphs: number;
	};
} & types.EvaluationRequest;

export default interface EvaluationClient {
	evaluate(request: EvaluationRequest, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
}
