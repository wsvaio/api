import type { Context } from "./types.d";
import { createContext, mergeContext } from "./context";
import type { WrapperResult } from "./request";
import { wrapper } from "./request";

export interface CreateAPIResult<C extends Record<any, any>> {
	get: WrapperResult<C>;
	post: WrapperResult<C>;
	put: WrapperResult<C>;
	patch: WrapperResult<C>;
	del: WrapperResult<C>;
	head: WrapperResult<C>;
	connect: WrapperResult<C>;
	trace: WrapperResult<C>;
	options: WrapperResult<C>;
	request: <D>(config2?: Context<C>) => Promise<D>;
	extendAPI: <T extends Record<any, any>>(config1?: Context<T & C>) => CreateAPIResult<T & C>;
	use: <K extends "error" | "before" | "after" | "final">(key: K) => (...args: Context<C>[`${K}s`]) => number;
}

export const createAPI = <C extends Record<any, any>>(
	config = {} as Context<{
		C: C;
	}>
): CreateAPIResult<C> => {
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
		extendAPI: config => createAPI(mergeContext(createContext(), context, config)),
		use:
			key =>
				(...args) =>
					context[`${key}s`].push(...args),
	};
};
