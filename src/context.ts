import { merge, omit } from "@wsvaio/utils";
import type { Context, MiddlewareContext } from "./types.d";

/**
 * 中间件的默认上下文。
 * @type {Context}
 */
const CONTEXT: Context = {};
/**
 * 合并两个中间件上下文。
 * @param {Context} context1 - 要合并的第一个上下文。
 * @param {Context} context2 - 要合并的第二个上下文。
 * @returns {Context} - 合并后的上下文。
 */
export const mergeContext = (context1: Context, context2: Context) => {
	const keys: (keyof MiddlewareContext)[] = ["befores", "afters", "errors", "finals"];

	keys.forEach(key => {
		!Array.isArray(context1[key]) && (context1[key] = []);
		Array.isArray(context2[key]) && context1[key].push(...context2[key]);
	});

	return merge(context1, omit(context2, keys), {
		deep: Infinity,
	});
};
/**
 * 创建新的中间件上下文。
 * @returns {Context} - 新的中间件上下文。
 */
export const createContext = (): Context =>
	mergeContext(
		{
			method: "get",
			headers: {},
			log: false,
			timeout: 0,
			url: "/",
			baseURL: "",

			b: {},
			q: {},
			p: {},

			query: null,
			body: null,
			param: null,

			befores: [],
			afters: [],
			errors: [],
			finals: [],

			message: "",
		},
		CONTEXT,
	);

/**
 * 设置全局中间件上下文配置。
 * @param {Context} config - 要设置的配置。
 * @returns {void}
 */
export const setGlobalContext = <C extends object = {}>(config: Context<C>) =>
	mergeContext(CONTEXT, config);
