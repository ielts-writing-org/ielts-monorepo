import type { Task2EvaluationResponse } from "ielts-shared";

const CRITERIA_KEYS = [
	"task_response",
	"coherence_and_cohesion",
	"lexical_resource",
	"grammatical_range_and_accuracy"
] as const satisfies readonly (keyof Task2EvaluationResponse["criteria"])[];

export const isCriteriaKey = (key: unknown): key is (typeof CRITERIA_KEYS)[number] =>
	CRITERIA_KEYS.includes(key as (typeof CRITERIA_KEYS)[number]);
