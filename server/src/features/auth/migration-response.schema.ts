import { z } from "zod";

export const MigrationResponseSchema = z.object({
	message: z.string(),
	created: z.array(z.string()).optional(),
	added: z.array(z.string()).optional()
});

export type MigrationResponse = z.infer<typeof MigrationResponseSchema>;
