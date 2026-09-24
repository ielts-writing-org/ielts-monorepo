import { inferdiHono } from "@inferdi/hono";
import { Container } from "@inferdi/inferdi";
import { CloudflareImagesClient } from "./infrastructure/image/images-client.cloudflare";
import { registerChatContainer } from "@/features/chat/chat.container";
import { registerEvaluationContainer } from "@/features/evaluation/evaluation.container";
import type { AppEnv } from "@/index";
import { CloudflareAiClient } from "@/infrastructure/ai/ai-client.cloudflare";
import { CloudflareConfigProvider } from "@/infrastructure/config/config-provider.cloudflare";

const isProduction = process.env.NODE_ENV !== "development";

interface RequestContext {
	readonly ai: Ai;
	readonly images: ImagesBinding;
	readonly task1KvNamespace: KVNamespace;
	readonly task2KvNamespace: KVNamespace;
}

export const root = new Container({ fast: isProduction })
	.declareScopeInputs<RequestContext>()
	.registerClass(
		"configProvider",
		CloudflareConfigProvider,
		["task1KvNamespace", "task2KvNamespace"],
		"scoped"
	)
	.registerClass("aiClient", CloudflareAiClient, ["ai", "configProvider"], "scoped")
	.registerClass("imagesClient", CloudflareImagesClient, ["images"], "scoped")
	.use(registerChatContainer)
	.use(registerEvaluationContainer);

const createRequestScope = (request: Partial<RequestContext>) => root.createScope(request);
export type RequestScope = ReturnType<typeof createRequestScope>;

export const inferdi = inferdiHono<typeof root, AppEnv>({
	container: root,
	createScope: (_root, c) =>
		createRequestScope({
			ai: c.env.AI,
			images: c.env.IMAGES,
			task1KvNamespace: c.env.TASK1_KV,
			task2KvNamespace: c.env.TASK2_KV
		})
});
