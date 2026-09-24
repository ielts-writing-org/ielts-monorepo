import { ConfigMissingError } from "./config-missing.error";
import type { ConfigProvider, TaskId } from "./config-provider.port";

const CHAT_PROMPT_KEY = "chat-prompt";
const EVALUATION_PROMPT_KEY = "evaluation-prompt";
const CACHE_TTL = 86_400;

// TODO: Test if ConfigMissingError is throw and HTTPException catch it
export class CloudflareConfigProvider implements ConfigProvider {
	constructor(
		private readonly task1KvNamespace: KVNamespace,
		private readonly task2KvNamespace: KVNamespace
	) {}

	private getKvNamespace(taskId: TaskId): KVNamespace {
		return taskId === "1" ? this.task1KvNamespace : this.task2KvNamespace;
	}

	private async get(taskId: TaskId, key: string): Promise<string> {
		const value = await this.getKvNamespace(taskId).get(key, {
			cacheTtl: CACHE_TTL
		});

		if (value === null) {
			throw new ConfigMissingError(key, taskId);
		}

		return value;
	}

	async getEvaluationPrompt(taskId: TaskId): Promise<string> {
		return await this.get(taskId, EVALUATION_PROMPT_KEY);
	}
	async getChatPrompt(taskId: TaskId): Promise<string> {
		return await this.get(taskId, CHAT_PROMPT_KEY);
	}
}
