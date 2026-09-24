interface DeterministicStats {
	words: number;
	sentences: number;
	characters: number;
	paragraphs: number;
}

export function computeDeterministicStats(text: string): DeterministicStats {
	return {
		words: countWords(text),
		sentences: countSentences(text),
		characters: countCharacters(text),
		paragraphs: countParagraphs(text)
	};
}

export function countCharacters(text: string): number {
	return text.replaceAll(/[\r\n]/g, "").length;
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

export function roundToNearestHalf(num: number): number {
	return (Math.sign(num) * Math.round(Math.abs(num * 2))) / 2;
}
