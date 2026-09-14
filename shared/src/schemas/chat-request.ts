import { z } from "zod";

export const ChatMessageSchema = z.discriminatedUnion("type", [
	z.object({
		role: z.enum(["user", "assistant"]),
		type: z.literal("content"),
		content: z.string().min(1)
	}),
	z.object({
		role: z.literal("user"),
		type: z.literal("context"),
		context: z.object({
			topic: z.string().min(1),
			response_text: z.string().min(1)
		})
	})
]);

export const ChatRequestSchema = z.array(ChatMessageSchema).min(2);

export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type ChatRequest = z.infer<typeof ChatRequestSchema>;
