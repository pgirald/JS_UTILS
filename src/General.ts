import { randInt } from "./numberOps";

export function sleep(ms: number, canceler?: AbortController) {
	return new Promise((r) => setTimeout(r, ms, { signal: canceler }));
}

export function createEventHandler<
	P extends any[],
	T extends (...args: P) => any
>() {
	const events: T[] = [];
	return {
		add(callBack: T) {
			events.push(callBack);
		},
		remove(callBack: T) {
			const idx = events.indexOf(callBack);
			if (idx !== -1) {
				events.splice(idx, 1);
			}
			return events;
		},
		trigger(params?: P) {
			for (const event of events) {
				event(...(params || ([] as any)));
			}
		},
	};
}

export function unspecified(value: any) {
	return value === null || value === undefined;
}

export function Gen(start: number = 1) {
	validate(start);
	let st = start;
	let current = st;
	return {
		next() {
			return current++;
		},
		reset() {
			current = st;
		},
		set start(value: number) {
			validate(value);
			st = value;
		},
		get start() {
			return st;
		},
	};

	function validate(value: number) {
		if (
			Number.isNaN(value) ||
			!Number.isFinite(value) ||
			!Number.isInteger(value)
		) {
			throw new Error(
				`The given number is not an integer or has an invalid
				value(NaN, (+|-)Infinity)`
			);
		}
	}
}

export function randElm<T>(elms: T[]) {
	return elms[randInt(0, elms.length - 1)];
}

export function randElms<T>(elms: T[], count: number) {
	const idxs: number[] = [];
	let num: number;
	if (count < 0) {
		throw new Error(`The count of random elms must be a positive integer.`);
	}
	if (count > elms.length) {
		throw new Error(
			`The count of random elms must be smaller than the elems length.`
		);
	}
	for (let i = 1; i <= count; i++) {
		num = randInt(0, elms.length - (count - i));
		if (idxs.includes(num)) {
			idxs.push(elms.length - 1 - (count - i));
		} else {
			idxs.push(num);
		}
	}
	return idxs.map((idx) => elms[idx]);
}

export function unique<T>(
	elms: T[],
	areEqual: (elm1: T, elm2: T) => boolean
): T[] {
	return elms.reduce<T[]>((acc, current) => {
		const x = acc.find((item) => areEqual(item, current)); // or use item.name === current.name
		if (!x) {
			acc.push(current);
		}
		return acc;
	}, []);
}
