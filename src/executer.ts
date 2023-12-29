import { compose } from "@wsvaio/utils";
import { mergeContext } from "./context";
import type { AfterContext, BeforeContext, CoreContext, ErrorContext, FinalContext } from "./types";
import { AFTERS, BEFORES, ERRORS, FINALS } from "./middleware";

export async function exec<T extends BeforeContext>(ctx: T) {
  return await compose(...BEFORES, ...ctx.befores)(ctx)
    .then(async () => mergeContext(ctx, await ctx.requester(ctx as CoreContext)))
    .then(() => compose(...AFTERS, ...ctx.afters)(ctx as AfterContext))
    .catch(error => compose(...ERRORS, ...ctx.errors)({ ...ctx, error } as ErrorContext))
    .finally(() => compose(...FINALS, ...ctx.finals)(ctx as FinalContext));
}
