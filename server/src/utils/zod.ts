import { z } from "zod";

export const preprocessJsonString = <T extends z.ZodType>(schema: T) => {
	return z.preprocess((val) => {
		try {
			return typeof val === "string" ? (JSON.parse(val) as unknown) : val;
		} catch {
			return val;
		}
	}, schema);
};
