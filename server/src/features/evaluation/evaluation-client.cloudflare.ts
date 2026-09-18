import type { EvaluationRequest } from "ielts-shared/schemas/evaluation-request";
import { EvaluationResponseSchema } from "ielts-shared/schemas/evaluation-response";
import type EvaluationClient from "./evaluation-client.port";
import type ConfigProvider from "@/core/dynamic-config/config-provider.port";

const CONFIGS = {
	id: "@cf/google/gemma-4-26b-a4b-it",
	schemaName: "writing-evaluation",
	schemaDescription: "Evaluation of the IELTS Writing response",
	seed: 2026,
	temperature: 0.2,
	maxOutputTokens: 4500
} as const satisfies {
	id: keyof AiModels;
	schemaName: string;
	schemaDescription: string;
	seed: number;
	temperature: number;
	maxOutputTokens: number;
};

export default class CloudflareEvaluationClient implements EvaluationClient {
	constructor(
		private readonly ai: Ai,
		private readonly configProvider: ConfigProvider
	) {}
	async evaluate(
		request: EvaluationRequest & {
			taskId: 1 | 2;
			deterministic: { words: number; sentences: number; characters: number; paragraphs: number };
		},
		signal: AbortSignal
	): Promise<ReadableStream<Uint8Array>> {
		const systemPrompt = await this.configProvider.getEvaluationPrompt(request.taskId);

		const stream = await this.ai.run(
			CONFIGS.id,
			{
				seed: CONFIGS.seed,
				temperature: CONFIGS.temperature,
				max_completion_tokens: CONFIGS.maxOutputTokens,
				messages: [
					{ role: "system", content: systemPrompt },
					{ role: "user", content: JSON.stringify(request) }
				],
				response_format: {
					type: "json_schema",
					json_schema: {
						name: CONFIGS.schemaName,
						description: CONFIGS.schemaDescription,
						schema: EvaluationResponseSchema.toJSONSchema()
					}
				},
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
