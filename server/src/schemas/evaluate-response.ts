import { z } from "zod";

const EvaluateCheckSchema = z.object({
	id: z.string(),
	name: z.string().meta({ description: "Human-friendly name" }),
	weight: z.number().min(0).max(1),
	status: z.enum(["met", "partially_met", "not_met"]),
	why: z.string().min(1)
});

const EvaluateProblemSchema = z.object({
	description: z.string().min(1),
	advice: z.string().min(1)
});

const EvaluateCriterionSchema = z
	.object({
		band: z.number().min(0).max(9).multipleOf(0.5).nullable(),
		checks: z.array(EvaluateCheckSchema).min(1).meta({
			description: "Include all checks even they are not met."
		}),
		problems: z.array(EvaluateProblemSchema).meta({
			description: "Fixable problems exist in the response."
		}),
		why_this_band: z.string(),
		why_not_next_band: z.string().optional()
	})
	.meta({
		id: "EvaluateCriterion"
	});

export const EvaluateResponseSchema = z.object({
	criteria: z.object({
		task_response: EvaluateCriterionSchema,
		coherence_and_cohesion: EvaluateCriterionSchema,
		lexical_resource: EvaluateCriterionSchema,
		grammatical_range_and_accuracy: EvaluateCriterionSchema
	}),
	overall_band: z.number().min(0).max(9).multipleOf(0.5).nullable().meta({
		description: "The overall score based on the 4 criteria."
	})
});

export type EvaluateCheck = z.infer<typeof EvaluateCheckSchema>;
export type EvaluateProblem = z.infer<typeof EvaluateProblemSchema>;
export type EvaluateCriterion = z.infer<typeof EvaluateCriterionSchema>;
export type EvaluateResponse = z.infer<typeof EvaluateResponseSchema>;
