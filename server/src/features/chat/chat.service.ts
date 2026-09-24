import type { AiClient } from "@/infrastructure/ai/ai-client.port";
import type { ImagesClient } from "@/infrastructure/image/images-client.port";
import type { ChatRequest } from "@/schemas/chat-request";
import { computeDeterministicStats } from "@/utils/computation";

export class ChatService {
	constructor(
		private readonly aiClient: AiClient,
		private readonly imagesClient: ImagesClient
	) {}

	chat = async (request: ChatRequest, signal: AbortSignal) => {
		let base64Image: string | undefined;
		if (request.taskContext.id === "1" && request.taskContext.image) {
			base64Image = await this.imagesClient.standardCompress({ image: request.taskContext.image });
		}

		const stats = computeDeterministicStats(request.taskContext.response || "");

		return await this.aiClient.chat(
			{
				...request,
				taskContext: {
					id: request.taskContext.id,
					prompt: request.taskContext.prompt,
					response: request.taskContext.response,
					...(base64Image && { image: base64Image }),
					stats: stats
				}
			},
			signal
		);
	};
}
