import { omit } from "@wsvaio/utils";
import { mergeContext } from "./context";
import type { AfterPatch, BeforeContext, BeforePatch, FinalContext } from "./types";
import { exec } from "./executer";

export function request<B extends BeforePatch, A extends AfterPatch>(context: BeforeContext<B, A>) {
  return (config?: Partial<BeforeContext<B, A>>) => {
    return exec(mergeContext({}, context, config));
  };
}

/**
 * 无限递归柯里化包装请求器
 */
export function currying<B extends BeforePatch, A extends AfterPatch>(context: BeforeContext<B, A>) {
  function result(config: (Partial<BeforeContext<B, A>> & { config: true }) | string): typeof result;
  function result(config?: Partial<BeforeContext<B, A>> & { config?: false }): Promise<FinalContext<B, A>>;
  function result(config: (Partial<BeforeContext<B, A>> & { config?: boolean }) | string = {}) {
    const ctx = mergeContext({}, context);
    if (typeof config === "string") {
      ctx.url = config;
      return currying<B, A>(ctx);
    }
    else {
      mergeContext(ctx, omit(config, ["config"]));
      if (config.config === true)
        return currying<B, A>(ctx);
      else return exec(ctx);
    }
  }

  return result;
}
