import { describeRoute } from 'hono-openapi';

export const addTask2ChatOpenApiDef = describeRoute({
	tags: ['Task 2'],
	summary: 'Chat with the AI assistant',
	description: 'Send a message to the AI assistant and receive a response',
	responses: {
		200: {
			description: 'Chat response SSE stream',
			content: {
				'text/event-stream': {
					schema: {
						type: 'string',
						description: 'The chat response stream in text/event-stream format'
					}
				}
			}
		},
		400: {
			$ref: '#/components/responses/InvalidRequestBody'
		}
	}
});
