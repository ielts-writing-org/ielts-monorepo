import { z } from "zod";

const CheckEvaluationResponseSchema = z.object({
	id: z.string(),
	weight: z.number().min(0).max(1),
	status: z.enum(["met", "partially_met", "not_met", "not_applicable"]),
	evidence: z.string().max(200),
	why: z.string().max(200)
});

const ProblemEvaluationResponseSchema = z.object({
	what: z.string(),
	evidence: z.string(),
	how_to: z.string()
});

const CriterionEvaluationResponseSchema = z.object({
	band: z.number().nullable(),
	checks: z.array(CheckEvaluationResponseSchema),
	problems: z.array(ProblemEvaluationResponseSchema),
	why_this_band: z.string(),
	why_not_next_band: z.string().nullable()
});

export const EvaluationResponseSchema = z.object({
	criteria: z.object({
		task_response: CriterionEvaluationResponseSchema,
		coherence_and_cohesion: CriterionEvaluationResponseSchema,
		lexical_resource: CriterionEvaluationResponseSchema,
		grammatical_range_and_accuracy: CriterionEvaluationResponseSchema
	}),
	overall_band: z.number().nullable()
});

export type CheckEvaluationResponse = z.infer<typeof CheckEvaluationResponseSchema>;
export type ProblemEvaluationResponse = z.infer<typeof ProblemEvaluationResponseSchema>;
export type CriterionEvaluationResponse = z.infer<typeof CriterionEvaluationResponseSchema>;
export type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;
