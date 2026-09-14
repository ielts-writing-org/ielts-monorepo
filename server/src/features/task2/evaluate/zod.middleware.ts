import { validator } from "hono-openapi";
import { Task2EvaluationRequestSchema } from "ielts-shared/schemas/evaluation-request";

export const validateTask2EvaluateRequest = validator("json", Task2EvaluationRequestSchema);
