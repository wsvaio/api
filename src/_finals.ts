import { dateFormat, merge, is } from "@wsvaio/utils";
import type { TContext } from "./types";
export const _finals: TContext["_finals"] = [
  async (ctx, next) => {
    await next();
    if (!ctx.log) return;
    const response = ctx.response || { ok: false, status: 100, statusText: "Continue" };
    const Params = Object.setPrototypeOf({}, new function params() { });
    const Result = Object.setPrototypeOf({}, new function result() { });
    const Context = Object.setPrototypeOf({}, new function context() { });
    merge(Params, is("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    merge(Result, is("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    merge(Context, ctx);
    console.groupCollapsed(`%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${response.status} ${response.statusText} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${response.ok ? '#67C23A' : '#F56C6C'}; border-radius: 0 3px 3px 0;`,
    );
    console.log(Params);
    console.log(Result);
    console.log(Context);
    console.groupEnd();
  }
]

