import type { Container, Spec } from "@inferdi/inferdi";
import { ChatService } from "./chat.service";
import type { AiClient } from "@/infrastructure/ai/ai-client.port";
import type { ImagesClient } from "@/infrastructure/image/images-client.port";

export function registerChatContainer(
	c: Container<{
		aiClient: Spec<AiClient, "scoped">;
		imagesClient: Spec<ImagesClient, "scoped">;
	}>
) {
	return c.registerClass("chatService", ChatService, ["aiClient", "imagesClient"], "scoped");
}
