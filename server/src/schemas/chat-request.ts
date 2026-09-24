import { z } from "zod";
import { chatMessageSchema } from "ielts-server/schemas/chat-message";
import { EvaluateResponseSchema } from "ielts-server/schemas/evaluate-response";
import { taskContextSchema } from "ielts-server/schemas/task-context";

export const ChatRequestSchema = z.object({
	taskContext: taskContextSchema,
	messages: z.array(chatMessageSchema).min(1),
	evaluateResponse: EvaluateResponseSchema.optional()
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;
