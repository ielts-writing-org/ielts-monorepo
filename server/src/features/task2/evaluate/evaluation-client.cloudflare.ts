import { EVALUATION_MODEL } from '../shared/config';
import type { ConfigsProvider } from '../shared/configs-provider.port';
import type { EvaluateCommand, EvaluationClient } from './evaluation-client.port';

export class CloudflareEvaluationClient implements EvaluationClient {
	constructor(
		private readonly ai: Ai,
		private readonly configsProvider: ConfigsProvider
	) {}

	async evaluate(
		command: EvaluateCommand,
		signal: AbortSignal
	): Promise<ReadableStream<Uint8Array>> {
		const configs = await this.configsProvider.get();

		const stream = await this.ai.run(
			EVALUATION_MODEL.id,
			{
				seed: EVALUATION_MODEL.seed,
				temperature: EVALUATION_MODEL.temperature,
				max_completion_tokens: EVALUATION_MODEL.maxOutputTokens,
				messages: [
					{ role: 'system', content: configs.evaluationPrompt },
					{ role: 'user', content: JSON.stringify(command) }
				],
				response_format: {
					type: 'json_schema',
					json_schema: {
						name: EVALUATION_MODEL.schemaName,
						description: EVALUATION_MODEL.schemaDescription,
						schema: configs.responseSchema
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
