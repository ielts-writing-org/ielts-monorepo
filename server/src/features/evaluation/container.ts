import type { Container, Spec } from "@inferdi/inferdi";
import CloudflareEvaluationClient from "./evaluation-client.cloudflare";
import EvaluationService from "./evaluation-service";
import type ConfigProvider from "@/core/dynamic-config/config-provider.port";

export function registerEvaluationContainer(
	c: Container<{
		configProvider: Spec<ConfigProvider, "scoped">;
	}>
) {
	return c
		.declareScopeInputs<{
			ai: Ai;
		}>()
		.registerClass(
			"evaluationClient",
			CloudflareEvaluationClient,
			["ai", "configProvider"],
			"scoped"
		)
		.registerClass("evaluationService", EvaluationService, ["evaluationClient"], "scoped");
}
