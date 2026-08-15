import { computeDeterministicStats } from '@ielts/shared';
import { CONTAINER_CLASSES, CONTAINER_SCOPE_INPUTS } from '../shared/config';
import { addTask2EvaluateOpenApiDef } from './openapi.middleware';
import { validateTask2EvaluateRequest } from './zod.middleware';
import { factory } from '@/shared/app-env';

export const task2EvaluateEndpoint = factory.createApp();

task2EvaluateEndpoint.post(
	'/',
	addTask2EvaluateOpenApiDef,
	validateTask2EvaluateRequest,
	async (c) => {
		const request = c.req.valid('json');

		await using scope = c.var.di.createScope({
			[CONTAINER_SCOPE_INPUTS.ai]: c.env.AI,
			[CONTAINER_SCOPE_INPUTS.kvNamespace]: c.env.TASK2_KV
		});
		const evaluationClient = scope.get(CONTAINER_CLASSES.evaluationClient);

		const stats = computeDeterministicStats(request.response_text);
		const input = {
			...request,
			deterministic: {
				...stats
			}
		};

		const stream = await evaluationClient.evaluate(input, c.req.raw.signal);

		return c.body(stream, 200, { 'Content-Type': 'text/event-stream' });
	}
);
