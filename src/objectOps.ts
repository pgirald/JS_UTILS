export function shallowCopy<T extends object>(obj: T): T {
	const copy: any = {};
	Object.keys(obj).forEach((key) => (copy[key] = (obj as any)[key]));
	return copy;
}

export type ObjectKeys<T extends object> = {
	readonly [key in keyof T]: key;
};

export function getKeys<T extends object>(obj: T): ObjectKeys<T> {
	let keys: any = {};
	Object.keys(obj).forEach((key) => (keys[key] = key));
	return keys;
}

export class InvalidParamsError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "InvalidParamsError";
	}
}

export function range(start: number, end: number): number[] {
	if (start > end) {
		throw new InvalidParamsError("Start cannot be greater than end");
	}
	const len = Math.abs(end - start + 1);
	const arr = Array(len);
	for (let i = 0; i < len; i++) {
		arr[i] = start + i;
	}
	return arr;
}

export function getPage<T>(
	arr: T[],
	page: number,
	count: number
): [T[], boolean] {
	if (!Number.isInteger(page) || !Number.isInteger(count)) {
		throw new Error(
			`Both the ${nameOf({ page })} and ${nameOf({
				count,
			})} parameters must be integers`
		);
	}
	if (count < 0) {
		throw new Error(
			`The ${nameOf({ count })} parameter must be a non-negative integer`
		);
	}
	if (page === -1 && count > 0) {
		return [arr.slice(-count), arr.at(-count - 1) !== undefined];
	}
	let hasMore: boolean;
	const start = page * count;
	const end = start + count;
	if (page < 0) {
		hasMore = arr.at(start - 1) !== undefined;
	} else {
		hasMore = arr.at(end) !== undefined;
	}
	return [arr.slice(start, end), hasMore];
}

export function isEmpty(o?: object) {
	if (!o) {
		return true;
	}
	return Object.keys(o).length === 0;
}

type SinglePropertyObject<T> = {
	[K in keyof T]: T[K];
} & {
	[K in keyof T]: unknown;
} extends T
	? T
	: never;

export function nameOf<T extends object>(o: SinglePropertyObject<T>) {
	return Object.keys(o)[0];
}

export function typedKeys<T extends object>(obj: T): (keyof T)[] {
	return Object.keys(obj) as (keyof T)[];
}

export function forEachObj(
	obj: Object,
	callback: (obj: Object) => any
): void {
	const seen = new Set();
	let value: any;

	function deepReplace(obj) {
		if (typeof obj !== "object" || seen.has(obj)) {
			return;
		}
		callback(obj);
		seen.add(obj);
		for (const key in obj) {
			if (obj.hasOwnProperty(key) && typeof (value = obj[key]) === "object") {
				deepReplace(value);
			}
		}
	}

	deepReplace(obj);
}
