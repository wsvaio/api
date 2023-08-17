import { compose, merge } from "@wsvaio/utils";
import type {
	Context,
} from "./types.d";
import { AFTERS, BEFORES, ERRORS, FINALS, MIDDLE } from "./middleware";

/**
 * 组合所有的中间件函数并执行
 * @param ctx - 上下文对象，包含请求相关信息和中间件函数
 * @returns Promise<void>
 */
export const run = <T extends Context>(ctx: T) =>
	compose<T>(
		...ctx.befores,
		...BEFORES
	)(ctx)
		.then(() => MIDDLE(ctx))
		.then(() => compose(...AFTERS, ...ctx.afters)(ctx))
		.catch(error => compose(...ERRORS, ...ctx.errors)(merge(ctx, { error })))
		.finally(() => compose(...FINALS, ...ctx.finals)(ctx));
