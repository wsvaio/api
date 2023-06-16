import type { ConfigContext, Context, CreateAPIResult, MiddlewareContext } from "./types.d";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

/**
 * 创建 API。
 * @param {ConfigContext} config - API 配置。
 * @returns {CreateAPIResult} - API 结果。
 * @template C - API 配置的类型。
 */
export const createAPI = <C extends object = {}>(config = {} as ConfigContext & C): CreateAPIResult<C> => {
	const context = mergeContext(createContext(), config) as Context<C>;
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
		request: wrapper<C>(context)(),
		extendAPI: <Custom extends object = {}>(config1 = {} as ConfigContext & Partial<C> & Custom) =>
			createAPI(mergeContext(mergeContext(createContext(), context), config1)),
		use:
			<K extends "before" | "after" | "error" | "final">(key: K) =>
				(...args: MiddlewareContext<C>[`${K}s`]) =>
					context[`${key}s`].push(...args),
	};
};
