import type { Container, Spec } from "@inferdi/inferdi";
import { EvaluationService } from "./evaluation.service";
import type { AiClient } from "@/infrastructure/ai/ai-client.port";
import type { ImagesClient } from "@/infrastructure/image/images-client.port";

export function registerEvaluationContainer(
	c: Container<{
		aiClient: Spec<AiClient, "scoped">;
		imagesClient: Spec<ImagesClient, "scoped">;
	}>
) {
	return c.registerClass(
		"evaluationService",
		EvaluationService,
		["aiClient", "imagesClient"],
		"scoped"
	);
}
