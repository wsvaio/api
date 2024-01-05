import { compose } from "@wsvaio/utils";
import { mergeContext } from "./utils";
import type { AfterPatch, BasicContext, FinalContext } from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS } from "./middleware";

// 基本执行器
export async function exec<B extends Record<any, any>, A extends AfterPatch>(
  ctx: BasicContext<B, A>
): Promise<FinalContext<B, A>> {
  // @ts-expect-error pass
  return await compose(
    ...BEFORES,
    // @ts-expect-error pass
    ...ctx.befores
    // @ts-expect-error pass
  )(ctx)
    // @ts-expect-error pass
    .then(async () => mergeContext(ctx, await ctx.requester(ctx)))
    // @ts-expect-error pass
    .then(() => compose(...AFTERS, ...ctx.afters)(ctx))
    // @ts-expect-error pass
    .catch(error => compose(...ERRORS, ...ctx.errors)(mergeContext(ctx, { error })))
    // @ts-expect-error pass
    .finally(() => compose(...FINALS, ...ctx.finals)(ctx));
}
