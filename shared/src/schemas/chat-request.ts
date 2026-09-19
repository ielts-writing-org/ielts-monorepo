import { z } from "zod";
import { EvaluationResponseSchema } from "./evaluation-response";

export const ChatContextRequestSchema = z.object({
	role: z.literal("user"),
	type: z.literal("context"),
	context: z.discriminatedUnion("taskId", [
		z.object({
			taskId: z.literal(1),
			taskPrompt: z.string(),
			taskImage: z.string(),
			responseText: z.string()
		}),
		z.object({
			taskId: z.literal(2),
			taskPrompt: z.string(),
			responseText: z.string()
		})
	])
});

export const ChatContentRequestSchema = z.object({
	role: z.enum(["user", "assistant"]),
	type: z.literal("content"),
	content: z
		.string()
		.trim()
		.min(1, { error: (i) => `Chat content must have atleast ${i.minimum.toString()} character` })
});

export const ChatRequestSchema = z.object({
	chatContext: ChatContextRequestSchema,
	evaluation: EvaluationResponseSchema.nullish(),
	chatHistory: z.array(ChatContentRequestSchema).min(1)
});

export type ChatContextRequest = z.infer<typeof ChatContextRequestSchema>;
export type ChatContentRequest = z.infer<typeof ChatContentRequestSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
