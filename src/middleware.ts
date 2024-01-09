import { is, merge } from "@wsvaio/utils";
import type { AfterContext, BeforeContext, ErrorContext, FinalContext, Middleware } from "./types";
import { getFullPath } from "./utils";

export const BEFORES: Middleware<BeforeContext>[] = [
  // 拼接请求路径 fullPath
  async (ctx, next) => {
    if (ctx.log)
      ctx.startTime = new Date();
    await next();
    if (!ctx.url) {
      ctx.fullPath = getFullPath(ctx);
      ctx.url = ctx.base + ctx.fullPath;
    }
  },
];

export const AFTERS: Middleware<AfterContext>[] = [
  async ctx => {
    if (ctx.status < 200 || ctx.status > 299)
      throw new Error(ctx.message);
  },
];

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
    const P = Object.setPrototypeOf({}, new function params() {}());
    const R = Object.setPrototypeOf({}, new function result() {}());
    const C = Object.setPrototypeOf({}, new function context() {}());
    merge(P, is("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    merge(R, is("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    merge(C, ctx);
    const { groupCollapsed = console.log, groupEnd = console.log, log } = console;
    groupCollapsed(
      `%c ${ctx.startTime.toLocaleTimeString()} %c ${ctx.method} %c ${ctx.fullPath} %c ${ctx.status} %c ${
        ctx.message
      } %c ${ctx.duration}ms `,
      "font-size: 16px; font-weight: 100; color: white; background: #747D8C; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #FFA502",
      "font-size: 16px; font-weight: 100; color: white; background: #1E90FF",
      `font-size: 16px; font-weight: 100; color: white; background: ${
        ctx.status && ctx.status >= 200 && ctx.status < 299 ? "#2ED573" : "#FF4757"
      };`,
      `font-size: 16px; font-weight: 100; color: white; background: ${!ctx.error ? "#2ED573" : "#FF4757"};`,
      "font-size: 16px; font-weight: 100; color: white; background: #747D8C; border-radius: 0 3px 3px 0;"
    );
    log(P);
    log(R);
    log(C);
    groupEnd();
  },
];
