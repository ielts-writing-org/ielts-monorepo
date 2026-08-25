import { z } from 'zod';

// Positive
const task2EvaluationCheckSchema = z.object({
	id: z.string(),
	weight: z.number().min(0).max(1),
	status: z.enum(['met', 'partially_met', 'not_met', 'not_applicable']),
	evidence: z.string().max(200),
	why: z.string().max(200)
});

// Negative
const task2EvaluationProblemSchema = z.object({
	what: z.string(),
	evidence: z.string(),
	how_to: z.string()
});

const task2EvaluationCriterionSchema = z.object({
	band: z.number().nullable(),
	checks: z.array(task2EvaluationCheckSchema),
	problems: z.array(task2EvaluationProblemSchema),
	why_this_band: z.string(),
	why_not_next_band: z.string().nullable()
});

export const task2EvaluationResponseSchema = z.object({
	criteria: z.object({
		task_response: task2EvaluationCriterionSchema,
		coherence_and_cohesion: task2EvaluationCriterionSchema,
		lexical_resource: task2EvaluationCriterionSchema,
		grammatical_range_and_accuracy: task2EvaluationCriterionSchema
	}),
	overall_band: z.number().nullable()
});

export type Task2EvaluationCheck = z.infer<typeof task2EvaluationCheckSchema>;
export type Task2EvaluationProblem = z.infer<typeof task2EvaluationProblemSchema>;
export type Task2EvaluationCriterion = z.infer<typeof task2EvaluationCriterionSchema>;
export type Task2EvaluationResponse = z.infer<typeof task2EvaluationResponseSchema>;
