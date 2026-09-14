import { validator } from "hono-openapi";
import { ChatRequestSchema } from "ielts-shared/schemas/chat-request";

export const validateTask2ChatRequest = validator("json", ChatRequestSchema);
