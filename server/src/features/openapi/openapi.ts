import type { Hono } from 'hono';
import { openAPIRouteHandler } from 'hono-openapi';
import type { AppEnv } from '@/shared/app-env';

export function handleOpenAPIRoute(app: Hono<AppEnv>) {
	return openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: 'IELTS Writing APIs',
				version: '1.0.0',
				description: 'API documentation for the IELTS Writing application',
				contact: {
					name: 'IELTS Writing Support',
					email: 'admin@ptus04.id.vn',
					url: 'http://ielts-writing.ptus04.id.vn'
				},
				termsOfService: 'http://ielts-writing.ptus04.id.vn/terms-of-service'
			},
			servers: [{ url: 'http://localhost:8787', description: 'Local Development Server' }],
			tags: [
				{
					name: 'Task 2',
					description: 'APIs related to Task 2 writing evaluation'
				}
			],
			components: {
				responses: {
					InvalidRequestBody: {
						description: 'Request body validation failed',
						content: {
							'application/json': {
								schema: {
									type: 'object',
									required: ['error', 'message', 'issues'],
									properties: {
										error: {
											type: 'string',
											description: 'A short error code representing the error type'
										},
										message: {
											type: 'string',
											description: 'A human-readable message describing the error'
										},
										issues: {
											type: 'array',
											items: {
												type: 'object',
												required: ['path', 'message'],
												properties: {
													path: { type: 'string' },
													message: { type: 'string' }
												}
											},
											description: 'An array of specific issues found in the request'
										}
									}
								}
							}
						}
					}
				}
			}
		}
	});
}
