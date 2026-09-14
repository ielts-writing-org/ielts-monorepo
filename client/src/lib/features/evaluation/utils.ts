import type { EvaluationResponse } from "ielts-shared/schemas/evaluation-response";

const CRITERIA_KEYS = [
	"task_response",
	"coherence_and_cohesion",
	"lexical_resource",
	"grammatical_range_and_accuracy"
] as const satisfies readonly (keyof EvaluationResponse["criteria"])[];

export const isCriteriaKey = (key: unknown): key is (typeof CRITERIA_KEYS)[number] =>
	CRITERIA_KEYS.includes(key as (typeof CRITERIA_KEYS)[number]);
