import { compose, merge } from "@wsvaio/utils";
import { createContext, mergeContext } from "./context";
import type {
  AfterContext,
  BeforeContext,
  ConfigContext,
  Context,
  CurryingResult,
  ErrorContext,
  FinalContext,
} from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS, MIDDLE } from "./middleware";

export const run = <T extends Context>(ctx: T) =>
  compose(
    ...ctx.befores,
    ...BEFORES,
  )(ctx as BeforeContext)
    .then(() => MIDDLE(ctx))
    .then(() => compose(...AFTERS, ...ctx.afters)(ctx as AfterContext))
    .catch(error => compose(...ERRORS, ...ctx.errors)(merge(ctx as ErrorContext, { error })))
    .finally(() => compose(...FINALS, ...ctx.finals)(ctx as FinalContext));

export const request
  = <C>(context: Context<C>) =>
    (method?: Context["method"]): CurryingResult<C> => {
      const ctx = mergeContext(createContext(), context);
      ctx.method = method || "get";
      console.log(ctx);
      function currying<P extends object = {}, R = any>(config: ConfigContext<C, P, R> & { config: true } | string): CurryingResult<C, P, R>;
      function currying<P extends object = {}, R = any>(config?: ConfigContext<C, P, R> & { config?: false }): Promise<R>;
      function currying<P extends object = {}, R = any>(config = {} as ConfigContext<C, P, R> & { config?: boolean } | string) {
        if (typeof config === "string") {
          ctx.url = config;
          return currying;
        }
        if (config && config.config) {
          mergeContext(ctx, config);
          return currying;
        }
        else {
          mergeContext(config, ctx);
          return run(config).then(() => ctx.data);
        }
      }
      return currying;
    };
