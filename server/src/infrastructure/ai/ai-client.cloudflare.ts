import type { AiClient, ChatRequest, EvaluateRequest } from "./ai-client.port";
import type { ConfigProvider } from "@/infrastructure/config/config-provider.port";
import { EvaluateResponseSchema } from "@/schemas/evaluate-response";

const Configs = {
	id: "@cf/google/gemma-4-26b-a4b-it",
	schemaName: "writing-evaluation",
	seed: 2026,
	temperature: 0.2,
	maxOutputTokens: 4500,
	enableThinking: false
} as const satisfies {
	id: keyof AiModels;
	schemaName: string;
	seed: number;
	temperature: number;
	maxOutputTokens: number;
	enableThinking: boolean;
};

type AiMessages = AiModels[typeof Configs.id]["inputs"]["messages"];

export class CloudflareAiClient implements AiClient {
	constructor(
		private readonly ai: Ai,
		private readonly configProvider: ConfigProvider
	) {}
	async chat(request: ChatRequest, signal: AbortSignal): Promise<ReadableStream<Uint8Array>> {
		const systemPrompt = await this.configProvider.getChatPrompt(request.taskContext.id);

		const messages = [
			{ role: "system", content: [{ type: "text", text: systemPrompt }] },
			{
				role: "user",
				content: [
					{
						type: "text",
						text: JSON.stringify(request.taskContext, (k, v) =>
							k === "image" ? undefined : (v as unknown)
						)
					},
					...(request.taskContext.image
						? [{ type: "image_url" as const, image_url: { url: request.taskContext.image } }]
						: [])
				]
			},
			...(request.evaluationResponse
				? [
						{
							role: "assistant" as const,
							content: [{ type: "text" as const, text: JSON.stringify(request.evaluationResponse) }]
						}
					]
				: []),
			...request.messages.map((c) => ({
				role: c.role,
				content: [{ type: "text" as const, text: c.content }]
			}))
		] satisfies AiMessages;

		const stream = await this.ai.run(
			Configs.id,
			{
				seed: Configs.seed,
				temperature: Configs.temperature,
				max_completion_tokens: Configs.maxOutputTokens,
				messages: messages,
				chat_template_kwargs: { enable_thinking: Configs.enableThinking },
				stream: true
			},
			{ signal }
		);
		return stream;
	}

	async evaluate(
		request: EvaluateRequest,
		signal: AbortSignal
	): Promise<ReadableStream<Uint8Array>> {
		const systemPrompt = await this.configProvider.getEvaluationPrompt(request.id);

		const messages = [
			{ role: "system", content: [{ type: "text", text: systemPrompt }] },
			{
				role: "user",
				content: [
					{
						type: "text",
						text: JSON.stringify(request, (k, v) => (k === "image" ? undefined : (v as unknown)))
					},
					...(request.image
						? [{ type: "image_url" as const, image_url: { url: request.image } }]
						: [])
				]
			}
		] as const satisfies AiMessages;

		const stream = await this.ai.run(
			Configs.id,
			{
				seed: Configs.seed,
				temperature: Configs.temperature,
				max_completion_tokens: Configs.maxOutputTokens,
				messages: messages,
				response_format: {
					type: "json_schema",
					json_schema: {
						name: Configs.schemaName,
						schema: EvaluateResponseSchema.toJSONSchema()
					}
				},
				chat_template_kwargs: { enable_thinking: Configs.enableThinking },
				stream: true
			},
			{ signal }
		);
		return stream;
	}
}
