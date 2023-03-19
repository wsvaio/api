import { compose, merge } from "@wsvaio/utils";
import { mergeContext } from "./context";
import type { AfterContext, BeforeContext, ConfigContext, ErrorContext, FinalContext } from "./types";
import { afters, befores, core, errors, finals } from "./middleware";

export const request
  = <C>(context: Record<any, any>) =>
    (method?: ConfigContext["method"]) =>
      <P extends object = {}, R = any>(conf1 = {} as (ConfigContext<C, P, R> | string)) =>
        async <Result = R>(conf2 = {} as ConfigContext<C, P, Result>): Promise<Result> => {
          const ctx = merge({}, context, { deep: Infinity }) as BeforeContext;
          ctx.method = method || "get";
          typeof conf1 == "string" ? (ctx.url = conf1) : mergeContext(ctx, conf1);
          mergeContext(ctx, conf2);
          await compose(...ctx.befores, ...befores)(ctx)
            .then(() => core(ctx))
            .then(() => compose(...afters, ...ctx.afters)(ctx as AfterContext))
            .catch(error => compose(...errors, ...ctx.errors)(merge(ctx as ErrorContext, { error })))
            .finally(() => compose(...finals, ...ctx.finals)(ctx as FinalContext));
          return (ctx as FinalContext).data;
        };
