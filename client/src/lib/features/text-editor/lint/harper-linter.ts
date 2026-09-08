import { Dialect, Lint, LocalLinter, type Linter } from "harper.js";
import { binary } from "harper.js/binary";

/**
 * Harper.js singleton class
 * @example
 * const lints = await HarperLinter.lint(text);
 */
export class HarperLinter {
	static #linter?: Linter;

	private constructor() {}

	static async lint(text: string): Promise<Lint[]> {
		if (!this.#linter) {
			this.#linter = new LocalLinter({
				binary,
				dialect: Dialect.American
			});
			await this.#linter.getLintConfig();
			await this.#linter.setup();
		}

		return await this.#linter.lint(text);
	}

	static async dispose() {
		await this.#linter?.dispose();
		this.#linter = undefined;
	}
}
