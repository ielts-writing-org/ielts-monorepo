import type ConfigProvider from "./config-provider.port";
import { ConfigError } from "@/core/error-handling/errors";

const CONFIGS = {
	evaluationPrompt: "evaluation-prompt",
	chatPrompt: "chat-prompt",
	cacheTtl: 86_400
} as const;

export default class CloudflareConfigProvider implements ConfigProvider {
	constructor(
		private readonly task1KvNamespace: KVNamespace,
		private readonly task2KvNamespace: KVNamespace
	) {}

	async getEvaluationPrompt(taskId: 1 | 2): Promise<string> {
		let result: string | null = null;

		if (taskId === 1) {
			result = await this.task1KvNamespace.get(CONFIGS.evaluationPrompt, {
				cacheTtl: CONFIGS.cacheTtl
			});
		} else {
			result = await this.task2KvNamespace.get(CONFIGS.evaluationPrompt, {
				cacheTtl: CONFIGS.cacheTtl
			});
		}

		if (!result) {
			throw new ConfigError(
				`Evaluation prompt has not been configured: ${CONFIGS.evaluationPrompt} is null`
			);
		}
		return result;
	}
	async getChatPrompt(taskId: 1 | 2): Promise<string> {
		let result: string | null = null;

		if (taskId === 1) {
			result = await this.task1KvNamespace.get(CONFIGS.chatPrompt, {
				cacheTtl: CONFIGS.cacheTtl
			});
		} else {
			result = await this.task2KvNamespace.get(CONFIGS.chatPrompt, {
				cacheTtl: CONFIGS.cacheTtl
			});
		}

		if (!result) {
			throw new ConfigError(`Chat prompt has not been configured: ${CONFIGS.chatPrompt} is null`);
		}
		return result;
	}
}
