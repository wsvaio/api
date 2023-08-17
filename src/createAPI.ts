import type { BasicContext, Context } from "./types.d";
import { createContext, mergeContext } from "./context";
import { run } from "./request";

export const createAPI = <C extends Record<any, any>>(
	config = {} as Context<{
		C: C;
	}>
) => {
	const context = mergeContext(createContext(), config);
	return {
		get: <T extends Record<any, any>>(ctx: Context<{ B: T["b"]; Q: T["q"]; P: T["p"] }> & T) =>
			run(mergeContext(context, { method: "get", ...ctx })),
		extendAPI: <_C extends Record<any, any>>(config1 = {} as Context<{ C: _C & C }>) =>
			createAPI(mergeContext(mergeContext(createContext(), context), config1)),
		use:
			<K extends "before" | "after" | "error" | "final">(key: K) =>
				(...args: BasicContext<{ C: C }>[`${K}s`]) =>
					context[`${key}s`].push(...args),
	};
};
