export function isValidTaskId(taskId: string | number): boolean {
	if (typeof taskId === "string") {
		return ["1", "2"].includes(taskId);
	} else {
		return [1, 2].includes(taskId);
	}
}
