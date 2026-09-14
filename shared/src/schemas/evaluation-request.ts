import { z } from "zod";

export const Task1EvaluationRequestSchema = z.object({
	response_text: z.string().trim().min(1).max(15000)
});

export const Task2EvaluationRequestSchema = z.object({
	task_prompt: z.string().trim().min(1).max(2000),
	response_text: z.string().trim().min(1).max(15000)
});

export type Task1EvaluationRequest = z.infer<typeof Task2EvaluationRequestSchema>;
export type Task2EvaluationRequest = z.infer<typeof Task2EvaluationRequestSchema>;
