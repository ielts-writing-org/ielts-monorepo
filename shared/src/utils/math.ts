/**
 * Làm tròn số đến 0.5 gần nhất
 * @param num Số cần làm tròn
 * @returns Số đã được làm tròn đến 0.5 gần nhất
 * @example
 * roundToHalf(1.3) // 1.5
 * roundToHalf(1.7) // 2
 */
export function roundToHalf(num: number): number {
	return Math.round(num * 2) / 2;
}
