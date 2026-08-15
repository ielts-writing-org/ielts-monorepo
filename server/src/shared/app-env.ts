import type { InferdiHonoEnv } from '@inferdi/hono';
import { createFactory } from 'hono/factory';
import type { RootContainer } from './container';

export type AppEnv = {
	Bindings: CloudflareBindings;
} & InferdiHonoEnv<RootContainer>;

export const factory = createFactory<AppEnv>();
