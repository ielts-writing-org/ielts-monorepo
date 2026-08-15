import { describeRoute } from 'hono-openapi';

export const addTask2EvaluateOpenApiDef = describeRoute({
	tags: ['Task 2'],
	summary: 'Evaluate a task 2 writing submission',
	description: 'Evaluate a task 2 writing submission',
	responses: {
		200: {
			description: 'Evaluation result SSE stream',
			content: {
				'text/event-stream': {
					schema: {
						type: 'string',
						description: 'The evaluation result stream in text/event-stream format'
					}
				}
			}
		},
		400: {
			$ref: '#/components/responses/InvalidRequestBody'
		}
	}
});
