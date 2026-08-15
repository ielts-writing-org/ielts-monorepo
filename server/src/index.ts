import { inferdiHono } from '@inferdi/hono';
import { cors } from 'hono/cors';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { handleOpenAPIRoute } from './features/openapi/openapi';
import { handleScalarRoute } from './features/scalar/scalar';
import { task2Endpoint } from './features/task2';
import { factory } from './shared/app-env';
import { buildRootContainer } from './shared/container';
import { toErrorResponse } from './shared/errors';

const root = buildRootContainer();
const app = factory.createApp();

app.onError((error, c) => {
	const { status, body } = toErrorResponse(error);
	return c.json(body, status as ContentfulStatusCode);
});

app.use('*', cors());
app.use('*', inferdiHono({ container: root }));

app.get('/', (c) => c.json({ status: 'ok' }));

if (process.env.NODE_ENV === 'development') {
	app.get('/openapi', handleOpenAPIRoute(app));
	app.get('/scalar', handleScalarRoute());
}

app.route('/api/task2', task2Endpoint);

export default app;
