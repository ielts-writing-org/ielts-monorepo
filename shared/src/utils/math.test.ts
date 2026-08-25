import { describe, expect, test } from 'vitest';
import { roundToHalf } from './math.ts';

describe('MATH UTILS', () => {
	describe('ROUND TO HALF', () => {
		test.each([
			[1.0, 1.0],
			[1.2, 1.0],
			[1.5, 1.5],
			[1.7, 1.5],
			[1.75, 2.0],
			[1.82, 2.0]
		])('roundToHalf(%f) should return %f', (num, expected) => {
			const output = roundToHalf(num);
			expect(output).toBe(expected);
		});
	});
});
