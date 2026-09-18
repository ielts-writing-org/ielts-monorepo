import { z } from "zod";

export const EvaluationRequestSchema = z.object({
	task_prompt: z.string().trim().min(1).max(2000),
	response_text: z.string().trim().min(1).max(15000)
});

export type EvaluationRequest = z.infer<typeof EvaluationRequestSchema>;
