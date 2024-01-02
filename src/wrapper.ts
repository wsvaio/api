import { omit } from "@wsvaio/utils";
import { mergeContext } from "./context";
import type { AfterC, BeforeContext, FinalContext, Requester } from "./types";
import { exec } from "./executer";

/**
 * 生成柯里化函数
 * @param context - 上下文对象，包含请求相关信息和中间件函数
 * @returns 柯里化函数
 */
export function currying<B extends Record<any, any>, A extends AfterC>(
  context: Partial<BeforeContext<B, A>> & { requester: typeof Requester<B, A> }
) {
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
      else return exec(ctx) as Promise<FinalContext<B, A>>;
    }
  }

  return result;
}
