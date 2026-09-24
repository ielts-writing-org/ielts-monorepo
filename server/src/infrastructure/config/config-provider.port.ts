export type TaskId = "1" | "2";

export interface ConfigProvider {
	getEvaluationPrompt(taskId: TaskId): Promise<string>;
	getChatPrompt(taskId: TaskId): Promise<string>;
}
