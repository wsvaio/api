import { mergeConfig } from "./mergeConfig";
import { actuator } from "./actuator";
import type { TContext } from "./types";
import { merge } from "@wsvaio/utils";
export const method = <T extends object = {}>(context: TContext<T>) =>
  (method?: TContext["method"]) =>
    <params extends object = {}, result extends object = {}>(conf1 = <Partial<TContext<T, params, result>> | string>{}) =>
      async <P extends object = params, R extends object = result>(conf2 = <Partial<TContext<T, P, R>>>{}) => {
        const ctx = <Record<any, any>>merge({}, context, { deep: Infinity });
        ctx.method = method ?? "get";
        typeof conf1 == "string" ? ctx.url = conf1 : mergeConfig(ctx, conf1);
        mergeConfig(ctx, conf2);
        const result = await actuator(ctx, ...ctx._befores, ...ctx.befores, ctx.core, ...ctx._afters, ...ctx.afters)
          .catch(async err => {
            ctx.error = err;
            return await actuator(ctx, ...ctx._errors, ...ctx.errors);
          })
          .finally(async () => {
            await actuator(ctx, ...ctx._finals, ...ctx.finals);
          });
        return <R>result.data;
      }