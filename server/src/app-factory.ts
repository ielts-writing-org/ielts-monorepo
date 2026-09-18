import type { InferdiHonoEnv } from "@inferdi/hono";
import type { Session, User } from "better-auth";
import { createFactory } from "hono/factory";
import type { RootContainer } from "./container";

export type AppEnv = {
	Bindings: CloudflareBindings;
	Variables: {
		session?: Session | null;
		user?: User | null;
	};
} & InferdiHonoEnv<RootContainer>;

const appFactory = createFactory<AppEnv>();

export default appFactory;
