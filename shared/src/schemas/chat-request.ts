import { z } from 'zod';

export const chatMessageSchema = z.discriminatedUnion('type', [
	z.object({
		role: z.enum(['user', 'assistant']),
		type: z.literal('content'),
		content: z.string().min(1)
	}),
	z.object({
		role: z.literal('user'),
		type: z.literal('context'),
		context: z.object({
			topic: z.string().min(1),
			response_text: z.string().min(1)
		})
	})
]);

export const chatRequestSchema = z.array(chatMessageSchema).min(1);

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
