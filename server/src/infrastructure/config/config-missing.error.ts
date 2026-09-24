import type { TaskId } from "./config-provider.port";

export class ConfigMissingError extends Error {
	constructor(
		public readonly key: string,
		public readonly taskId: TaskId
	) {
		super(`Configuration "${key}" is not configured for task ${taskId}`);
	}
}
