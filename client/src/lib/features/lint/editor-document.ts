export interface DomPoint {
	node: Text;
	offset: number;
}

interface TextSegment {
	node: Text;
	start: number;
	end: number;
}

const BLOCK_ELEMENTS = new Set([
	"ADDRESS",
	"ARTICLE",
	"ASIDE",
	"BLOCKQUOTE",
	"DIV",
	"DL",
	"FIELDSET",
	"FIGCAPTION",
	"FIGURE",
	"FOOTER",
	"FORM",
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6",
	"HEADER",
	"HR",
	"LI",
	"MAIN",
	"NAV",
	"OL",
	"P",
	"PRE",
	"SECTION",
	"TABLE",
	"TR",
	"UL"
]);

function isBlockElement(element: Element): boolean {
	return BLOCK_ELEMENTS.has(element.tagName);
}

function scalarLength(value: string): number {
	return Array.from(value).length;
}

function scalarToUtf16(text: string, scalarOffset: number): number {
	if (scalarOffset <= 0) {
		return 0;
	}

	let utf16Offset = 0;
	let scalars = 0;

	for (const char of text) {
		if (scalars >= scalarOffset) {
			break;
		}

		utf16Offset += char.length;
		scalars++;
	}

	return utf16Offset;
}

export class EditorDocument {
	private readonly segments: TextSegment[] = [];
	private readonly textValue: string;

	constructor(private readonly root: HTMLElement) {
		const parts: string[] = [];
		let position = 0;

		const append = (value: string): void => {
			if (!value) {
				return;
			}

			parts.push(value);
			position += scalarLength(value);
		};

		const appendNewline = (): void => {
			// Prevent multiple adjacent block separators.
			if (parts.at(-1)?.endsWith("\n")) {
				return;
			}

			append("\n");
		};

		const visit = (node: Node): void => {
			if (node.nodeType === Node.TEXT_NODE) {
				const text = node.nodeValue ?? "";

				if (text.length === 0) {
					return;
				}

				const start = position;

				append(text);

				this.segments.push({
					node: node as Text,
					start,
					end: position
				});

				return;
			}

			if (node.nodeType !== Node.ELEMENT_NODE) {
				return;
			}

			const element = node as Element;

			if (element.tagName === "BR") {
				appendNewline();
				return;
			}

			for (const child of Array.from(node.childNodes)) {
				visit(child);
			}

			if (isBlockElement(element)) {
				appendNewline();
			}
		};

		for (const child of Array.from(root.childNodes)) {
			visit(child);
		}

		// A trailing newline represents the boundary after
		// the final block rather than actual editable text.
		if (parts.at(-1) === "\n") {
			parts.pop();
		}

		this.textValue = parts.join("");
	}

	get text(): string {
		return this.textValue;
	}

	resolve(offset: number): DomPoint {
		const clamped = Math.max(0, Math.min(offset, scalarLength(this.textValue)));

		for (const segment of this.segments) {
			if (clamped >= segment.start && clamped <= segment.end) {
				const scalarOffset = clamped - segment.start;

				return {
					node: segment.node,
					offset: scalarToUtf16(segment.node.data, scalarOffset)
				};
			}
		}

		const last = this.segments.at(-1);

		if (!last) {
			throw new Error("Cannot resolve offset: editor has no text nodes.");
		}

		return {
			node: last.node,
			offset: last.node.data.length
		};
	}
}
