import { z } from "zod";
import { countWords } from "@/utils/computation";

const CHAT_MESSAGE_MIN_WORDS = 1;
const CHAT_MESSAGE_MAX_WORDS = 100;

const userContentSchema = z
	.string()
	.refine((val) => countWords(val) >= CHAT_MESSAGE_MIN_WORDS, {
		error: `Chat message must have at least ${CHAT_MESSAGE_MIN_WORDS} words`
	})
	.refine((val) => countWords(val) <= CHAT_MESSAGE_MAX_WORDS, {
		error: `Chat message must have at most ${CHAT_MESSAGE_MAX_WORDS} words`
	});

export const chatMessageSchema = z.discriminatedUnion("role", [
	z.object({
		role: z.literal("assistant"),
		content: z.string()
	}),
	z.object({
		role: z.literal("user"),
		content: userContentSchema
	})
]);

export type ChatMessage = z.infer<typeof chatMessageSchema>;
