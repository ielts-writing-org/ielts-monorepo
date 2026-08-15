import type { Task2EvaluationRequest } from '@ielts/shared/schemas';

export type EvaluateCommand = Task2EvaluationRequest & {
	deterministic: {
		words: number;
		sentences: number;
		characters: number;
		paragraphs: number;
	};
};

export interface EvaluationClient {
	evaluate(command: EvaluateCommand, signal: AbortSignal): Promise<ReadableStream<Uint8Array>>;
}
