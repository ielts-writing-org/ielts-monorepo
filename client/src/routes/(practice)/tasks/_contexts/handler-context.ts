import { createContext } from 'svelte';
import type { Task2EvaluationHandler } from '../_handlers/task2-evaluation-handler.svelte';
import type { Task2ChatHandler } from '../_handlers/task2-chat-handler.svelte';

type HandlerContext = {
	task2EvaluationHandler: Task2EvaluationHandler;
	task2ChatHandler: Task2ChatHandler;
};

export const [getHandlerContext, setHandlerContext] = createContext<HandlerContext>();
