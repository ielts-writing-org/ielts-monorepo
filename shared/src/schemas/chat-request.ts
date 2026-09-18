import { z } from "zod";
import { EvaluationResponseSchema } from "./evaluation-response";

export const ChatContextRequestSchema = z.object({
	role: z.literal("user"),
	type: z.literal("context"),
	context: z.discriminatedUnion("taskId", [
		z.object({
			taskId: z.literal(1),
			taskPrompt: z.string().trim().min(1),
			taskImage: z.string().trim().min(1),
			responseText: z.string().trim().min(1)
		}),
		z.object({
			taskId: z.literal(2),
			taskPrompt: z.string().trim().min(1),
			responseText: z.string().trim().min(1)
		})
	])
});

export const ChatContentRequestSchema = z.object({
	role: z.enum(["user", "assistant"]),
	type: z.literal("content"),
	content: z.string().trim().min(1)
});

export const ChatRequestSchema = z.object({
	chatContext: ChatContextRequestSchema,
	evaluation: EvaluationResponseSchema.nullish(),
	chatHistory: z.array(ChatContentRequestSchema).min(1)
});

export type ChatContextRequest = z.infer<typeof ChatContextRequestSchema>;
export type ChatContentRequest = z.infer<typeof ChatContentRequestSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
