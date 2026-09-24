import type { ChatMessage } from "ielts-server/schemas/chat-message";
import type { EvaluateResponse } from "ielts-server/schemas/evaluate-response";
import type { TaskContext } from "ielts-server/schemas/task-context";
import { createContext } from "svelte";

export type PracticeContext = {
	task: TaskContext;
	chats: ChatMessage[];
	evaluateResponse?: EvaluateResponse;
};

export const [getPracticeContext, setPracticeContext, hasPracticeContext] =
	createContext<PracticeContext>();
