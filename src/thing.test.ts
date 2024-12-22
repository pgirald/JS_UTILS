import { expect, jest, test, describe } from "@jest/globals";
import * as numOps from "./numberOps";
import { randElms } from "./General";

describe("", () => {
	test.each<{
		elms: number[];
		randSequence: number[];
		count: number;
		expected: number[];
		shouldThrow: boolean;
	}>`
		elms                                  | randSequence       | count | expected           | shouldThrow
		${[0, 1, 2, 3, 4, 5, 6, 7]}           | ${[4, 1, 6, 7]}    | ${4}  | ${[4, 1, 6, 7]}    | ${false}
		${[0, 1, 2, 3, 4, 5, 6, 7]}           | ${[4, 4, 6, 6]}    | ${4}  | ${[4, 5, 6, 7]}    | ${false}
		${[0, 1, 2, 3, 4]}                    | ${[0, 1, 2, 3, 4]} | ${5}  | ${[0, 1, 2, 3, 4]} | ${false}
		${[0, 1, 2, 3, 4]}                    | ${[]}              | ${0}  | ${[]}              | ${false}
		${[0, 1, 2, 3]}                       | ${[0, 1, 2, 3, 4]} | ${5}  | ${null}            | ${true}
		${[0, 1, 2, 3]}                       | ${[0, 1]}          | ${-1} | ${null}            | ${true}
		${[0]}                                | ${[0]}             | ${1}  | ${[0]}             | ${false}
		${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} | ${[2, 2, 4, 4]}    | ${4}  | ${[2, 8, 4, 10]}   | ${false}
		${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}     | ${[4, 0, 4, 3]}    | ${4}  | ${[4, 0, 8, 3]}    | ${false}
		${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} | ${[5, 0, 2, 3]}    | ${4}  | ${[5, 0, 2, 3]}    | ${false}
		${[]}                                 | ${[]}              | ${1}  | ${null}            | ${true}
		${[]}                                 | ${[]}              | ${0}  | ${[]}              | ${false}
		${[0, 1, 2, 3]}                       | ${[0, 0, 2, 3]}    | ${4}  | ${[0, 1, 2, 3]}    | ${false}
	`(
		"should choose uniquely",
		({ elms, randSequence, count, expected, shouldThrow }) => {
			let i = 0;
			let selected: number[];
			// jest.mock("./General", () => ({
			// 	randInt: (min: number, max: number) => {
			// 		if (i >= randSequence.length) {
			// 			throw new Error("The requested element is out of the bounds.");
			// 		}
			// 		if (randSequence[i] < min || randSequence[i] >= max) {
			// 			throw new Error(
			// 				`${randSequence[i]} is not a number between ${min} and ${max}`
			// 			);
			// 		}
			// 		return randSequence[i++];
			// 	},
			// }));
			const mockRandInt = jest
				.spyOn(numOps, "randInt")
				.mockImplementation((min: number, max: number) => {
					if (i >= randSequence.length) {
						throw new Error("The requested element is out of the bounds.");
					}
					if (randSequence[i] < min || randSequence[i] >= max) {
						throw new Error(
							`${randSequence[i]} is not a number between ${min} and ${max}`
						);
					}
					return randSequence[i++];
				});
			if (shouldThrow) {
				expect(() => randElms(elms, count)).toThrow();
			} else {
				selected = randElms(elms, count);
				expect(selected).toEqual(expected);
				expect(selected.length).toBe(new Set(selected).size); //check uniqueness
			}
			mockRandInt.mockRestore();
		}
	);
});
