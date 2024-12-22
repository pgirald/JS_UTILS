import { createEventHandler } from "./General";

export type Optional<T extends object> = { [prop in keyof T]?: T[prop] };

export type Indexed<T> = { [idx: number]: T };

export type Identity<T> = { [P in keyof T]: T[P] };

export type Replace<T, K extends keyof T, TReplace> = Omit<T, K> & {
	[P in K]: TReplace;
};

export type EventHandler<
	P extends any[],
	T extends (...args: P) => any,
> = ReturnType<typeof createEventHandler<P, T>>;
