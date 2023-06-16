import { compose, merge, omit } from "@wsvaio/utils";
import { createContext, mergeContext } from "./context";
import type {
	AfterContext,
	BeforeContext,
	ConfigContext,
	Context,
	CurryingResult,
	ErrorContext,
	FinalContext,
} from "./types.d";
import { AFTERS, BEFORES, ERRORS, FINALS, MIDDLE } from "./middleware";

/**
 * 组合所有的中间件函数并执行
 * @param ctx - 上下文对象，包含请求相关信息和中间件函数
 * @returns Promise<void>
 */
export const run = <T extends Context>(ctx: T) =>
	compose(
		...ctx.befores,
		...BEFORES
	)(ctx as BeforeContext)
		.then(() => MIDDLE(ctx))
		.then(() => compose(...AFTERS, ...ctx.afters)(ctx as AfterContext))
		.catch(error => compose(...ERRORS, ...ctx.errors)(merge(ctx as ErrorContext, { error })))
		.finally(() => compose(...FINALS, ...ctx.finals)(ctx as FinalContext));
/**
 * 包装上下文对象并返回柯里化函数
 * @param context - 上下文对象，包含请求相关信息和中间件函数
 * @returns 柯里化函数
 */
export const wrapper
	= <C>(context: Context<C>) =>
		(method?: Context["method"]): CurryingResult<C> =>
			currying<C>({ ...context, method } as Context<C>);
/**
 * 生成柯里化函数
 * @param context - 上下文对象，包含请求相关信息和中间件函数
 * @returns 柯里化函数
 */
function currying<C>(context: Context<C>) {
	/**
	 * 执行请求并返回 Promise 结果
	 * @param config - 请求配置对象或请求地址字符串
	 * @returns Promise 结果
	 */
	function result<P extends object = {}, R = any>(
		config: (ConfigContext<C, P, R> & { config: true }) | string
	): CurryingResult<C, P, R>;
	/**
	 * 执行请求并返回 Promise 结果
	 * @param config - 请求配置对象
	 * @returns Promise 结果
	 */
	function result<P extends object = {}, R = any>(config?: ConfigContext<C, P, R> & { config?: false }): Promise<R>;
	/**
	 * 执行请求并返回 Promise 结果
	 * @param config - 请求配置对象或请求地址字符串
	 * @returns Promise 结果
	 */
	function result<P extends object = {}, R = any>(
		config = {} as (ConfigContext<C, P, R> & { config?: boolean }) | string
	) {
		const ctx = mergeContext(createContext(), context);
		if (typeof config === "string") config = { url: config, config: true } as ConfigContext<C, P, R> & { config: true };
		mergeContext(ctx, omit(config, ["config"]));
		return config?.config ? currying(ctx) : run(ctx).then(() => ctx.data);
	}
	return result;
}
