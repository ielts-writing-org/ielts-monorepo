import { EVALUATION_MODEL } from '../shared/config';
import type { ConfigsProvider } from '../shared/configs-provider.port';
import type { ChatClient, ChatCommand } from './chat-client.port';

export class CloudflareChatClient implements ChatClient {
	constructor(
		private readonly ai: Ai,
		private readonly configsProvider: ConfigsProvider
	) {}

	async ask(command: ChatCommand, signal: AbortSignal): Promise<ReadableStream<Uint8Array>> {
		const configs = await this.configsProvider.get();

		const messages = [
			{ role: 'system', content: configs.chatPrompt },
			...command.map((c) => {
				if (c.type === 'content') {
					return { role: c.role, content: c.content };
				} else {
					return {
						role: c.role,
						content: JSON.stringify({ ...c.context, deterministic: { ...c.deterministic } })
					};
				}
			})
		] as const satisfies { role: string; content: string }[];

		const stream = await this.ai.run(
			EVALUATION_MODEL.id,
			{
				seed: EVALUATION_MODEL.seed,
				temperature: EVALUATION_MODEL.temperature,
				max_completion_tokens: EVALUATION_MODEL.maxOutputTokens,
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
