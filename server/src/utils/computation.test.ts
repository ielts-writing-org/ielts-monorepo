import { describe, expect, test } from "vitest";
import { computeDeterministicStats, roundToNearestHalf } from "./computation.ts";

describe("computeDeterministicStats()", () => {
	test("empty text", () => {
		const stats = computeDeterministicStats("");

		expect(stats).toEqual({
			words: 0,
			sentences: 0,
			characters: 0,
			paragraphs: 0
		});
	});

	test("normal text", () => {
		const text = `This is a test. This is only a test.
This is the second paragraph.`;

		const stats = computeDeterministicStats(text);

		expect.soft(stats.words).toBe(14);
		expect.soft(stats.sentences).toBe(3);
		expect.soft(stats.characters).toBe(65);
		expect.soft(stats.paragraphs).toBe(2);
	});

	test("2 newline characters", () => {
		const text = `This is a test. This is only a test.
    
This is the second paragraph.`;

		const stats = computeDeterministicStats(text);

		expect.soft(stats.words).toBe(14);
		expect.soft(stats.sentences).toBe(3);
		expect.soft(stats.characters).toBe(69);
		expect.soft(stats.paragraphs).toBe(2);
	});
});

describe("roundToHalf()", () => {
	test.each([
		[0, 0],
		[0.24, 0],
		[0.25, 0.5],
		[0.74, 0.5],
		[-1.2, -1],
		[-1.25, -1.5],
		[1.0, 1.0],
		[1.2, 1.0],
		[1.5, 1.5],
		[1.7, 1.5],
		[1.75, 2.0],
		[1.82, 2.0]
	])("roundToHalf(%f) should return %f", (num, expected) => {
		const output = roundToNearestHalf(num);
		expect(output).toBe(expected);
	});
});
