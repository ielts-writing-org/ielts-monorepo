import { computeDeterministicStats } from '@ielts/shared';
import { CONTAINER_CLASSES, CONTAINER_SCOPE_INPUTS } from '../shared/config';
import type { ChatCommand } from './chat-client.port';
import { addTask2ChatOpenApiDef } from './openapi.middleware';
import { validateTask2ChatRequest } from './zod.middleware';
import { factory } from '@/shared/app-env';

export const task2ChatEndpoint = factory.createApp();

task2ChatEndpoint.post('/', addTask2ChatOpenApiDef, validateTask2ChatRequest, async (c) => {
	const request = c.req.valid('json');

	await using scope = c.var.di.createScope({
		[CONTAINER_SCOPE_INPUTS.ai]: c.env.AI,
		[CONTAINER_SCOPE_INPUTS.kvNamespace]: c.env.TASK2_KV
	});
	const chatClient = scope.get(CONTAINER_CLASSES.chatClient);

	const input: ChatCommand = [];
	for (const r of request) {
		if (r.type === 'context') {
			const stats = computeDeterministicStats(r.context.response_text);
			input.push({
				...r,
				deterministic: stats
			});
		} else {
			input.push(r);
		}
	}

	const stream = await chatClient.ask(input, c.req.raw.signal);

	return c.body(stream, 200, { 'Content-Type': 'text/event-stream' });
});
