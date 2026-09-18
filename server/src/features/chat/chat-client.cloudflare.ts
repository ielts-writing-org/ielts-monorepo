import type ChatClient from "./chat-client.port";
import type { ChatRequest } from "./chat-client.port";
import type ConfigProvider from "@/core/dynamic-config/config-provider.port";

const CONFIGS = {
	id: "@cf/google/gemma-4-26b-a4b-it",
	seed: 2026,
	temperature: 0.2,
	maxOutputTokens: 4500
} as const satisfies {
	id: keyof AiModels;
	seed: number;
	temperature: number;
	maxOutputTokens: number;
};

export default class CloudflareChatClient implements ChatClient {
	constructor(
		private readonly ai: Ai,
		private readonly configProvider: ConfigProvider
	) {}

	async chat(request: ChatRequest, signal: AbortSignal): Promise<ReadableStream<Uint8Array>> {
		const systemPrompt = await this.configProvider.getChatPrompt(
			request.chatContext.context.taskId
		);

		const messages = [
			{ role: "system", content: systemPrompt },
			{
				role: request.chatContext.role,
				content: JSON.stringify({
					...request.chatContext.context,
					deterministic: { ...request.chatContext.deterministic }
				})
			},
			{
				role: "assistant",
				content: request.evaluation ? JSON.stringify(request.evaluation) : "No evaluation yet"
			},
			...request.chatHistory.map((c) => {
				return { role: c.role, content: c.content };
			})
		] as const satisfies { role: string; content: string }[];

		const stream = await this.ai.run(
			CONFIGS.id,
			{
				seed: CONFIGS.seed,
				temperature: CONFIGS.temperature,
				max_completion_tokens: CONFIGS.maxOutputTokens,
				messages: messages,
				chat_template_kwargs: {
					enable_thinking: false
				},
				stream: true
			},
			{ signal }
		);
		return stream;
	}
}
