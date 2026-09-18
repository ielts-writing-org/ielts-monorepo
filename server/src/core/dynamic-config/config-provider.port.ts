export default interface ConfigProvider {
	getEvaluationPrompt(taskId: 1 | 2): Promise<string>;
	getChatPrompt(taskId: 1 | 2): Promise<string>;
}
