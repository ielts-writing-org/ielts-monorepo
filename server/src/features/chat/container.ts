import type { Container, Spec } from "@inferdi/inferdi";
import CloudflareChatClient from "./chat-client.cloudflare";
import ChatService from "./chat-service";
import type ConfigProvider from "@/core/dynamic-config/config-provider.port";

export function registerChatContainer(
	c: Container<{
		configProvider: Spec<ConfigProvider, "scoped">;
	}>
) {
	return c
		.declareScopeInputs<{
			ai: Ai;
		}>()
		.registerClass("chatClient", CloudflareChatClient, ["ai", "configProvider"], "scoped")
		.registerClass("chatService", ChatService, ["chatClient"], "scoped");
}
