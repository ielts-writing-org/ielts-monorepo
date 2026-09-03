import type { Container, Spec } from "@inferdi/inferdi";
import { CONTAINER_CLASSES, CONTAINER_SCOPE_INPUTS } from "../shared/config";
import type { ConfigsProvider } from "../shared/configs-provider.port";
import { CloudflareEvaluationClient } from "./evaluation-client.cloudflare";

export function registerTask2EvaluateContainer(
	c: Container<{
		[CONTAINER_CLASSES.configsProvider]: Spec<ConfigsProvider, "scoped">;
	}>
) {
	return c
		.declareScopeInputs<{
			[CONTAINER_SCOPE_INPUTS.ai]: Ai;
		}>()
		.registerClass(
			CONTAINER_CLASSES.evaluationClient,
			CloudflareEvaluationClient,
			[CONTAINER_SCOPE_INPUTS.ai, CONTAINER_CLASSES.configsProvider],
			"scoped"
		);
}
