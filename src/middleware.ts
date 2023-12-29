import { is, merge } from "@wsvaio/utils";
import type { AfterContext, BeforeContext, ErrorContext, FinalContext, Middleware } from "./types";
import { getFullPath } from "./utils";

export const BEFORES: Middleware<BeforeContext>[] = [
  // 拼接请求路径 fullPath
  async (ctx, next) => {
    await next();
    ctx.fullPath = getFullPath(ctx);
  },
];

export const AFTERS: Middleware<AfterContext>[] = [];

export const ERRORS: Middleware<ErrorContext>[] = [
  async (ctx, next) => {
    await next();
    ctx.message = ctx.error.message;
    throw ctx.error;
  },
];

export const FINALS: Middleware<FinalContext>[] = [
  async (ctx, next) => {
    ctx.endTime = new Date();
    ctx.duration = ctx.endTime.getTime() - ctx.startTime.getTime();
    await next();
    if (!ctx.log)
      return;
    const status = `${ctx.message}`;
    const Params = Object.setPrototypeOf({}, new function params() {}());
    const Result = Object.setPrototypeOf({}, new function result() {}());
    const Context = Object.setPrototypeOf({}, new function context() {}());
    merge(Params, is("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    merge(Result, is("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    merge(Context, ctx);
    console.groupCollapsed(
      `%c ${ctx.startTime.toLocaleTimeString()} %c ${ctx.method} %c ${ctx.fullPath} %c ${ctx.status} %c ${status} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${
        ctx.status && ctx.status >= 200 && ctx.status <= 299 ? "#67C23A" : "#F56C6C"
      }`,
      `font-size: 16px; font-weight: 100; color: white; background: ${
        !ctx.error ? "#67C23A" : "#F56C6C"
      }; border-radius: 0 3px 3px 0;`
    );
    console.log(Params);
    console.log(Result);
    console.log(Context);
    console.groupEnd();
  },
];
