import { KV_CONFIGS } from './config';
import type { Configs, ConfigsProvider } from './configs-provider.port';
import { ConfigError } from '@/shared/errors';

export class CloudflareConfigsProvider implements ConfigsProvider {
	constructor(private readonly kvNamespace: KVNamespace) {}

	async get(): Promise<Configs> {
		const [evaluationPrompt, chatPrompt, responseSchemaStr] = await Promise.all([
			this.kvNamespace.get(KV_CONFIGS.evaluationPrompt, { cacheTtl: KV_CONFIGS.cacheTtl }),
			this.kvNamespace.get(KV_CONFIGS.chatPrompt, { cacheTtl: KV_CONFIGS.cacheTtl }),
			this.kvNamespace.get(KV_CONFIGS.responseSchema, { cacheTtl: KV_CONFIGS.cacheTtl })
		]);
		if (!evaluationPrompt || !chatPrompt || !responseSchemaStr) {
			throw new ConfigError('One or more prompts missing from KV.');
		}
		return {
			evaluationPrompt: evaluationPrompt,
			chatPrompt: chatPrompt,
			responseSchema: JSON.parse(responseSchemaStr) as Record<string, unknown>
		};
	}
}
