import { z } from "zod";
import { ChatRequestSchema } from "@/schemas/chat-request";
import type { ChatRequest } from "@/schemas/chat-request";
import { jsonTask1ContextSchema, task2ContextSchema } from "@/schemas/task-context";
import { preprocessJsonString } from "@/utils/zod";

const ChatJsonDataSchema = ChatRequestSchema.extend({
	taskContext: z.discriminatedUnion("id", [jsonTask1ContextSchema, task2ContextSchema])
});

export const ChatFormRequestSchema = z
	.object({
		data: preprocessJsonString(ChatJsonDataSchema),
		taskImage: z.instanceof(File).optional()
	})
	.transform<ChatRequest>(({ data, taskImage }) => ({
		...data,
		taskContext: {
			...data.taskContext,
			...(data.taskContext.id === "1" && { image: taskImage })
		}
	}));

export type ChatFormRequest = z.infer<typeof ChatFormRequestSchema>;
