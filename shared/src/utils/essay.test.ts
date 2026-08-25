import { describe, expect, test } from 'vitest';
import { computeDeterministicStats, type DeterministicStats } from './essay.ts';

describe('ESSAY UTILS TESTS', () => {
	describe('DETERMINISTIC STATS TESTS', () => {
		test('empty text', () => {
			const stats = computeDeterministicStats('');

			expect(stats).toEqual({
				words: 0,
				sentences: 0,
				characters: 0,
				paragraphs: 0,
				averageSentenceLength: 0
			} satisfies DeterministicStats);
		});

		test('normal text', () => {
			const text = `This is a test. This is only a test.
This is the second paragraph.`;

			const stats = computeDeterministicStats(text);

			expect.soft(stats.words).toBe(14);
			expect.soft(stats.sentences).toBe(3);
			expect.soft(stats.characters).toBe(65);
			expect.soft(stats.paragraphs).toBe(2);
			expect.soft(stats.averageSentenceLength).toBeCloseTo(4.6667, 4);
		});

		test('2 newline characters', () => {
			const text = `This is a test. This is only a test.
    
This is the second paragraph.`;

			const stats = computeDeterministicStats(text);

			expect.soft(stats.words).toBe(14);
			expect.soft(stats.sentences).toBe(3);
			expect.soft(stats.characters).toBe(69);
			expect.soft(stats.paragraphs).toBe(2);
			expect.soft(stats.averageSentenceLength).toBeCloseTo(4.6667, 4);
		});
	});
});
