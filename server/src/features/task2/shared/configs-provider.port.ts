export interface Configs {
	evaluationPrompt: string;
	chatPrompt: string;
	responseSchema: Record<string, unknown>;
}

export interface ConfigsProvider {
	get(): Promise<Configs>;
}
