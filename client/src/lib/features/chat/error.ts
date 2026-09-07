export class HandlerExecutionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = HandlerExecutionError.name;
	}
}
