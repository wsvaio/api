import { compose, merge } from "@wsvaio/utils";
import type { Context } from "./types.d";
import { AFTERS, BEFORES, ERRORS, FINALS, MIDDLE } from "./middleware";
import { createContext, mergeContext } from "./context";

export const run = <T extends Context>(ctx: T) =>
	compose<T>(
		...ctx.befores,
		...BEFORES
	)(ctx)
		.then(() => MIDDLE(ctx))
		.then(() => compose(...AFTERS, ...ctx.afters)(ctx))
		.catch(error => compose(...ERRORS, ...ctx.errors)(merge(ctx, { error })))
		.finally(() => compose(...FINALS, ...ctx.finals)(ctx));

export type WrapperResult<C> = <
	T extends {
		b?: Record<any, any>;
		q?: Record<any, any>;
		p?: Record<any, any>;
		d?: any;
	} = {
		b?: Record<any, any>;
		q?: Record<any, any>;
		p?: Record<any, any>;
		d: any;
	}
>(
	config1:
	| (Context<{
		B: T["b"] extends unknown ? Record<any, any> : T["b"];
		Q: T["q"] extends unknown ? Record<any, any> : T["q"];
		P: T["p"] extends unknown ? Record<any, any> : T["p"];
		D: T["d"] extends unknown ? any : T["d"];
		C: C;
	}> &
	Partial<Omit<T, "d">>)
	| string
) => <D = T["d"]>(
	config2?: Context<{
		B: T["b"] extends unknown ? Record<any, any> : T["b"];
		Q: T["q"] extends unknown ? Record<any, any> : T["q"];
		P: T["p"] extends unknown ? Record<any, any> : T["p"];
		D: T["d"] extends unknown ? any : T["d"];
		C: C;
	}> &
	Omit<T, "d">
) => Promise<D>;

export const wrapper
	= <C>(context: Context) =>
		(method: Context["method"]) =>
			<
				T extends {
					b?: Record<any, any>;
					q?: Record<any, any>;
					p?: Record<any, any>;
					d?: any;
				} = {
					b?: Record<any, any>;
					q?: Record<any, any>;
					p?: Record<any, any>;
					d: any;
				}
			>(
				config1:
				| (Context<{
					B: T["b"] extends unknown ? Record<any, any> : T["b"];
					Q: T["q"] extends unknown ? Record<any, any> : T["q"];
					P: T["p"] extends unknown ? Record<any, any> : T["p"];
					D: T["d"] extends unknown ? any : T["d"];
					C: C;
			  }> &
				Partial<Omit<T, "d">>)
				| string
			) =>
				<D = T["d"]>(
					config2?: Context<{
						B: T["b"] extends unknown ? Record<any, any> : T["b"];
						Q: T["q"] extends unknown ? Record<any, any> : T["q"];
						P: T["p"] extends unknown ? Record<any, any> : T["p"];
						D: T["d"] extends unknown ? any : T["d"];
						C: C;
					}> &
					Omit<T, "d">
				) =>
					run(
						mergeContext(createContext(), context, typeof config1 === "string" ? { url: config1 } : config1, config2, {
							method,
						})
					).then(({ data }) => data as D);
