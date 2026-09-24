import type { AiClient } from "@/infrastructure/ai/ai-client.port";
import type { ImagesClient } from "@/infrastructure/image/images-client.port";
import type { EvaluateRequest } from "@/schemas/evaluate-request";
import { computeDeterministicStats } from "@/utils/computation";

export class EvaluationService {
	constructor(
		private readonly aiClient: AiClient,
		private readonly imagesClient: ImagesClient
	) {}

	evaluate = async (request: EvaluateRequest, signal: AbortSignal) => {
		let base64Image: string | undefined;
		if (request.id === "1") {
			base64Image = await this.imagesClient.standardCompress({ image: request.image });
		}

		const stats = computeDeterministicStats(request.response);

		return await this.aiClient.evaluate(
			{
				id: request.id,
				prompt: request.id,
				response: request.response,
				...(base64Image && { image: base64Image }),
				stats: stats
			},
			signal
		);
	};
}
