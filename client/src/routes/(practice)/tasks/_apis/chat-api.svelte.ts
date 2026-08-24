import { env } from '$env/dynamic/public';
import { chatRequestSchema, type ChatRequest } from '@ielts/shared';
import z from 'zod';

const abortController = $state({ current: new AbortController() });

export async function chatTask2(request: ChatRequest): Promise<ReadableStream<string>> {
	abortTask2Chat();

	const validRequest = z.parse(chatRequestSchema, request);

	const response = await fetch(env.PUBLIC_CHAT_API_URL, {
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
		throw new Error(`Unexpected response from chat API: ${response.status} ${response.statusText}`);
	}

	return response.body.pipeThrough(new TextDecoderStream());
}

export const abortTask2Chat = () => {
	abortController.current.abort();
	abortController.current = new AbortController();
};
