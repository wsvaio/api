import { compose } from "@wsvaio/utils";
import { mergeContext } from "./context";
import type { AfterPatch, BasicContext, FinalContext } from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS } from "./middleware";

export async function exec<B extends Record<any, any>, A extends AfterPatch>(
  ctx: BasicContext<B, A>
): Promise<FinalContext<B, A>> {
  return await compose<any>(
    ...BEFORES,
    ...ctx.befores
  )(ctx)
    .then(async () => mergeContext(ctx, await ctx.requester(ctx as any)))
    .then(() => compose<any>(...AFTERS, ...ctx.afters)(ctx))
    .catch(error => compose<any>(...ERRORS, ...ctx.errors)({ ...ctx, error }))
    .finally(() => compose<any>(...FINALS, ...ctx.finals)(ctx));
}
