import { compose, merge } from "@wsvaio/utils";
import { mergeContext } from "./context";
import { ConfigContext } from "./types";

export const request =
  <C>(context: Record<any, any>) =>
  (method?: ConfigContext["method"]) =>
  <P1 extends object = {}, R1 extends object = {}>(
    conf1 = {} as ConfigContext<C, P1, R1> | string
  ) =>
  async <P2 extends object = P1, R2 extends object = R1>(
    conf2 = {} as ConfigContext<C, P2, R2>
  ): Promise<R2> => {
    const ctx: Record<any, any> = merge({}, context, { deep: Infinity });
    ctx.method = method || "get";
    typeof conf1 == "string" ? (ctx.url = conf1) : mergeContext(ctx, conf1);
    mergeContext(ctx, conf2);
    await compose(...ctx.befores)(ctx)
      .then(() => ctx.core(ctx))
      .then(() => compose(...ctx.afters)(ctx))
      .catch(error => compose(...ctx.errors)(merge(ctx, { error })))
      .finally(() => compose(...ctx.finals)(ctx));
    return ctx.data;
  };
