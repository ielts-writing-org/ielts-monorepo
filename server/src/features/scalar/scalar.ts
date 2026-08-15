import { Scalar } from '@scalar/hono-api-reference';

export function handleScalarRoute() {
	return Scalar({
		url: '/openapi',
		pageTitle: 'IELTS Writing Scalar API Reference'
	});
}
