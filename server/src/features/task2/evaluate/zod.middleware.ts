import { validator } from "hono-openapi";
import { task2EvaluationRequestSchema } from "ielts-shared";

export const validateTask2EvaluateRequest = validator("json", task2EvaluationRequestSchema);
