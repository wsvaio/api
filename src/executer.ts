import { compose } from "@wsvaio/utils";
import { mergeContext } from "./context";
import type { AfterC, BasicContext, FinalContext, Requester } from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS } from "./middleware";

export async function exec<B extends Record<any, any>, A extends AfterC>(
  ctx: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> }
): Promise<FinalContext<B, A>> {
  return await compose<any>(
    ...BEFORES,
    ...ctx.befores
  )(ctx)
    .then(async () => mergeContext(ctx, await ctx.requester(ctx)))
    .then(() => compose<any>(...AFTERS, ...ctx.afters)(ctx))
    .catch(error => compose<any>(...ERRORS, ...ctx.errors)({ ...ctx, error }))
    .finally(() => compose<any>(...FINALS, ...ctx.finals)(ctx));
}
