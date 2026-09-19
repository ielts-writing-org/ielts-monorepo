import { z } from "zod";

export const EvaluationRequestSchema = z.object({
	task_prompt: z
		.string()
		.trim()
		.min(1, { error: (i) => `Task prompt must has atleast ${i.minimum.toString()} character.` })
		.max(2000, { error: (i) => `Task prompt must has atmost ${i.maximum.toString()} characters.` }),
	response_text: z
		.string()
		.trim()
		.min(1, { error: (i) => `Response text must has atleast ${i.minimum.toString()} character.` })
		.max(15000, {
			error: (i) => `Response text must has atmost ${i.maximum.toString()} characters.`
		})
});

export type EvaluationRequest = z.infer<typeof EvaluationRequestSchema>;
