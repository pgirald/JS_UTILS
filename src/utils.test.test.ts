import { Gen, randElm, unique, randElms } from "./General";
import {
	expect,
	test,
} from "@jest/globals";

// jest.mock('crypto', () => ({
//   ...jest.requireActual('crypto'), // keep original implementation for logMessage
//   randomInt: jest.fn((min,max) => 10), // mock calculateSum
// }));

test("Check Gen()", () => {
	let gen = Gen(2);
	expect(gen.start).toBe(2);
	expect(gen.next()).toBe(2);
	expect(gen.next()).toBe(3);
	expect(gen.next()).toBe(4);
	gen = Gen();
	expect(gen.start).toBe(1);
	expect(gen.next()).toBe(1);
	expect(gen.next()).toBe(2);
	expect(gen.next()).toBe(3);
	gen.start = 4;
	expect(gen.start).toBe(4);
	expect(gen.next()).toBe(4);
	expect(gen.next()).toBe(5);
	expect(gen.next()).toBe(6);
	gen.reset();
	expect(gen.start).toBe(4);
	expect(gen.next()).toBe(4);
	expect(gen.next()).toBe(5);
});

test.each<{
	elms: any[];
	areEqual: (obj1: any, obj2: any) => boolean;
	expected: any[];
}>([
	{
		elms: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Mao" },
			{ id: 3, name: "Cla" },
		],
		areEqual: (item1, item2) => item1.name === item2.name,
		expected: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Mao" },
			{ id: 3, name: "Cla" },
		],
	},
	{
		elms: [
			{ id: 1, name: "Pao" },
			{ id: 1, name: "Mao" },
			{ id: 3, name: "Pao" },
		],
		areEqual: (item1, item2) => item1.id === item2.id,
		expected: [
			{ id: 1, name: "Pao" },
			{ id: 3, name: "Pao" },
		],
	},
	{
		elms: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Pao" },
			{ id: 3, name: "Pao" },
		],
		areEqual: (item1, item2) => item1.name === item2.name,
		expected: [{ id: 1, name: "Pao" }],
	},
	{
		elms: [1, 2, 3, 2, 1],
		areEqual: (item1, item2) => item1 === item2,
		expected: [1, 2, 3],
	},
	{
		elms: [],
		areEqual: (item1, item2) => item1 === item2,
		expected: [],
	},
	{
		elms: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Mao" },
			{ id: 3, name: "Pao" },
			{ id: 4, name: "Mao" },
		],
		areEqual: (item1, item2) => item1.name === item2.name,
		expected: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Mao" },
		],
	},
	{
		elms: [
			{ id: 1, name: { first: "Pao" } },
			{ id: 2, name: { first: "Mao" } },
			{ id: 3, name: { first: "Pao" } },
		],
		areEqual: (item1, item2) => item1.name.first === item2.name.first,
		expected: [
			{ id: 1, name: { first: "Pao" } },
			{ id: 2, name: { first: "Mao" } },
		],
	},
])("Check unique()", ({ elms, areEqual, expected }) => {
	expect(unique(elms, areEqual)).toEqual(expected);
});

test.each<{ elms: any[]; expectedPossible: any[] }>([
	{
		elms: [1],
		expectedPossible: [1],
	},
	{
		elms: [1, 2, 3, 4, 5],
		expectedPossible: [1, 2, 3, 4, 5],
	},
	{
		elms: ["Pao", "Mao", "Cla"],
		expectedPossible: ["Pao", "Mao", "Cla"],
	},
	{
		elms: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Mao" },
			{ id: 3, name: "Cla" },
		],
		expectedPossible: [
			{ id: 1, name: "Pao" },
			{ id: 2, name: "Mao" },
			{ id: 3, name: "Cla" },
		],
	},
	{
		elms: [1, 1, 2, 2, 3],
		expectedPossible: [1, 1, 2, 2, 3],
	},
	{
		elms: [],
		expectedPossible: [],
	},
])("Check randElm()", ({ elms, expectedPossible }) => {
	if (elms.length === 0) {
		expect(randElm(elms)).toBeUndefined();
	} else {
		const result = randElm(elms);
		expect(expectedPossible).toContainEqual(result);
	}
});
