import type { EvaluateResponse } from "ielts-server/schemas/evaluate-response";

const CRITERIA_KEYS = [
	"coherence_and_cohesion",
	"grammatical_range_and_accuracy",
	"lexical_resource",
	"task_response"
] as const satisfies readonly (keyof EvaluateResponse["criteria"])[];

type CriteriaKeys = (typeof CRITERIA_KEYS)[number];

export const isCriteriaKey = (key: unknown): key is CriteriaKeys => {
	return CRITERIA_KEYS.includes(key as CriteriaKeys);
};
