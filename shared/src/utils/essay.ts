export interface DeterministicStats {
	words: number;
	sentences: number;
	characters: number;
	paragraphs: number;
	averageSentenceLength: number;
}

export function computeDeterministicStats(text: string): DeterministicStats {
	return {
		words: countWords(text),
		sentences: countSentences(text),
		characters: countCharacters(text),
		paragraphs: countParagraphs(text),
		averageSentenceLength: averageSentenceLength(text)
	};
}

export function countCharacters(text: string): number {
	return text.replaceAll(/[\r\n]/g, '').length;
}

export function countWords(text: string): number {
	return text.split(/\s+/).filter((token) => token.length > 0).length;
}

export function countSentences(text: string): number {
	return text
		.split(/[.!?…]+/)
		.map((part) => part.trim())
		.filter((part) => part.length > 0).length;
}

export function countParagraphs(text: string): number {
	return text
		.split(/\n[\s\n]*/)
		.map((part) => part.trim())
		.filter((part) => part.length > 0).length;
}

export function averageSentenceLength(text: string): number {
	const sentenceCount = countSentences(text);
	const wordCount = countWords(text);

	if (sentenceCount === 0) {
		return 0;
	}

	return wordCount / sentenceCount;
}
