import type { BasicContext, Context } from "./types.d";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

export const createAPI = <C extends Record<any, any>>(
	config = {} as Context<{
		C: C;
	}>
) => {
	const context = mergeContext(createContext(), config);
	return {
		get: wrapper<C>(context)("get"),
		post: wrapper<C>(context)("post"),
		put: wrapper<C>(context)("put"),
		patch: wrapper<C>(context)("patch"),
		del: wrapper<C>(context)("delete"),
		head: wrapper<C>(context)("head"),
		connect: wrapper<C>(context)("connect"),
		trace: wrapper<C>(context)("trace"),
		options: wrapper<C>(context)("options"),
		request: wrapper<C>(context)("get")({}),
		extendAPI: <T extends Record<any, any>>(config = {} as Context<{ C: T & C }>) =>
			createAPI(mergeContext(createContext(), context, config)),
		use:
			<T extends "before" | "after" | "error" | "final">(key: T) =>
				(...args: BasicContext<{ C: C }>[`${T}s`]) =>
					context[`${key}s`].push(...args),
	};
};
