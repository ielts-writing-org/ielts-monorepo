export const CONTAINER_CLASSES = {
	configsProvider: 'task2.evaluate.configsProvider',
	evaluationClient: 'task2.evaluate.evaluationClient',
	chatClient: 'task2.chat.chatClient'
} as const;

export const CONTAINER_SCOPE_INPUTS = {
	ai: 'ai',
	kvNamespace: 'kvNamespace'
} as const;

export const KV_CONFIGS = {
	evaluationPrompt: 'evaluation-prompt',
	chatPrompt: 'chat-prompt',
	responseSchema: 'response-schema',
	cacheTtl: 86_400
} as const;

export const EVALUATION_MODEL = {
	id: '@cf/google/gemma-4-26b-a4b-it',
	schemaName: 'task2-evaluation',
	schemaDescription: 'Evaluation of the IELTS Writing Task 2 response',
	seed: 42,
	temperature: 0.2,
	maxOutputTokens: 3000
} as const satisfies {
	id: keyof AiModels;
	schemaName: string;
	schemaDescription: string;
	seed: number;
	temperature: number;
	maxOutputTokens: number;
};
