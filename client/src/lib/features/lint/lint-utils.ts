import type { Lint } from "harper.js";
import { EditorDocument } from "./editor-document";

export interface EditorLint {
	id: string;
	start: number;
	end: number;
	kind: string;
	message: string;
	source: Lint;
}

/**
 * Convert Harper's lint result to EditorLint
 * @param lint
 * @param index
 * @returns
 * @example
 * const lints = await HarperLinter.lint(text);
 * const editorLints = lints.map(toEditorLint);
 */
export function toEditorLint(lint: Lint, index: number): EditorLint {
	const span = lint.span();

	return {
		id: `${span.start}-${span.end}-${index}`,
		start: span.start,
		end: span.end,
		kind: lint.lint_kind(),
		message: lint.message(),
		source: lint
	};
}

/**
 * Turn a lint span into a DOM Range
 * @param document
 * @param start
 * @param end
 * @returns DOM `Range`
 * @example
 * const document = new EditorDocument(editor);
 * const text = document.text;
 * const lints = await harper.lint(text);
 * for (const lint of lints) {
 *  const span = lint.span();
 *  const range = createLintRange(
 *      document,
 *      span.start,
 *      span.end
 *  );
 * 	console.log(range.toString());
 * }
 */
export function createLintRange(document: EditorDocument, start: number, end: number): Range {
	const startPoint = document.resolve(start);
	const endPoint = document.resolve(end);

	const range = new Range();
	range.setStart(startPoint.node, startPoint.offset);
	range.setEnd(endPoint.node, endPoint.offset);

	return range;
}

export interface LintRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface RenderedLint {
	lint: EditorLint;
	rects: LintRect[];
}

export function calculateLintRects(
	editor: HTMLElement,
	overlay: HTMLElement,
	lints: EditorLint[]
): RenderedLint[] {
	const document = new EditorDocument(editor);

	const overlayRect = overlay.getBoundingClientRect();
	overlay.style.width = `${editor.scrollWidth}px`;
	overlay.style.height = `${editor.scrollHeight}px`;

	return lints.map((lint) => {
		const range = createLintRange(document, lint.start, lint.end);

		const rects = Array.from(range.getClientRects()).map((rect) => ({
			x: rect.left - overlayRect.left,
			y: rect.top - overlayRect.top,
			width: rect.width,
			height: rect.height
		}));

		return {
			lint,
			rects
		};
	});
}

export type LintStyle = "spelling" | "grammar" | "style" | "punctuation" | "readability" | "other";

export function getLintStyle(kind: string): LintStyle {
	switch (kind) {
		case "Typo":
		case "Spelling":
			return "spelling";

		case "Grammar":
			return "grammar";

		case "Punctuation":
			return "punctuation";

		case "Style":
			return "style";

		default:
			return "other";
	}
}
