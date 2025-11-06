/**
 * Repeats the contents of an array until it reaches a specified length.
 *
 * - If the original array length is greater than or equal to `targetLength`, it’s returned as-is.
 * - If it’s shorter, the array’s elements are repeated in order until the desired length is reached.
 * - An empty input array returns as-is to avoid infinite repetition.
 *
 * @template T - The type of array elements.
 * @param {T[]} arr - The input array to repeat.
 * @param {number} targetLength - The minimum desired length of the output array.
 * @returns {T[]} A new array with at least `targetLength` elements.
 *
 * @example
 * // Basic usage:
 * arrayRepeatTo([1, 2, 3], 10);
 * // → [1, 2, 3, 1, 2, 3, 1, 2, 3, 1]
 *
 * @example
 * // Works with strings:
 * arrayRepeatTo(['a', 'b'], 5);
 * // → ['a', 'b', 'a', 'b', 'a']
 *
 * @example
 * // Longer array remains unchanged:
 * arrayRepeatTo([1, 2, 3, 4, 5, 6], 4);
 * // → [1, 2, 3, 4, 5, 6]
 *
 * @example
 * // Empty array stays empty:
 * arrayRepeatTo([], 10);
 * // → []
 */
export function arrayRepeatTo<T>(arr: T[], targetLength: number): T[] {
    if (arr.length === 0) return arr; // avoid infinite loop

    const result = [...arr];
    while (result.length < targetLength) {
        result.push(...arr);
    }

    return result.slice(0, targetLength);
}