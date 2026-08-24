import { env } from '$env/dynamic/public';
import { task2EvaluationRequestSchema, type Task2EvaluationRequest } from '@ielts/shared/schemas';
import z from 'zod';

const abortController = $state({ current: new AbortController() });

export async function evaluateTask2(
	request: Task2EvaluationRequest
): Promise<ReadableStream<string>> {
	abortTask2Evaluation();

	const validRequest = z.parse(task2EvaluationRequestSchema, request);

	const response = await fetch(env.PUBLIC_EVALUATION_API_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(validRequest),
		signal: abortController.current.signal
	});

	if (
		!response.ok ||
		!response.body ||
		response.headers.get('content-type') !== 'text/event-stream'
	) {
		throw new Error(
			`Unexpected response from evaluation API: ${response.status} ${response.statusText}`
		);
	}

	return response.body.pipeThrough(new TextDecoderStream());
}

export const abortTask2Evaluation = () => {
	abortController.current.abort();
	abortController.current = new AbortController();
};
