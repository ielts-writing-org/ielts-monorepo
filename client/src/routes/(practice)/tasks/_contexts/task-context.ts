import { createContext } from 'svelte';

export type TaskContext = {
	task_2: {
		topic: string;
		response: string;
	};
};

export const [getTaskContext, setTaskContext, hasTaskContext] = createContext<TaskContext>();
