import { z } from "zod";

const baseTaskContextSchema = z.object({
	prompt: z.string(),
	response: z.string()
});

export const jsonTask1ContextSchema = baseTaskContextSchema.extend({
	id: z.literal("1")
});

export const task1ContextSchema = baseTaskContextSchema.extend({
	id: z.literal("1"),
	image: z.instanceof(File).optional()
});

export const task2ContextSchema = baseTaskContextSchema.extend({
	id: z.literal("2")
});

export const taskContextSchema = z.discriminatedUnion("id", [
	task1ContextSchema,
	task2ContextSchema
]);

export type Task1Context = z.infer<typeof task1ContextSchema>;
export type Task2Context = z.infer<typeof task2ContextSchema>;
export type TaskContext = z.infer<typeof taskContextSchema>;
