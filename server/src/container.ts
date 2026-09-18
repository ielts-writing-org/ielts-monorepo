import { Container } from "@inferdi/inferdi";
import CloudflareConfigProvider from "./core/dynamic-config/config-provider.cloudflare";
import { registerChatContainer } from "./features/chat/container";
import { registerEvaluationContainer } from "./features/evaluation/container";

export type RootContainer = ReturnType<typeof buildRootContainer>;

export function buildRootContainer() {
	return new Container({ fast: true })
		.declareScopeInputs<{
			task1KvNamespace: KVNamespace;
			task2KvNamespace: KVNamespace;
		}>()
		.registerClass(
			"configProvider",
			CloudflareConfigProvider,
			["task1KvNamespace", "task2KvNamespace"],
			"scoped"
		)
		.use(registerEvaluationContainer)
		.use(registerChatContainer);
}
