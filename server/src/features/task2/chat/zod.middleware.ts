import { validator } from "hono-openapi";
import { chatRequestSchema } from "ielts-shared";

export const validateTask2ChatRequest = validator("json", chatRequestSchema);
