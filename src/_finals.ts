import { dateFormat, isSimpleObject } from "@wsvaio/utils";
import { ctx } from "./env";
export const _finals: ctx["_finals"] = [
  async ctx => {
    if (!ctx.log) return;
    const response = ctx.response || { ok: false, status: 100, statusText: "Continue" };
    const data = isSimpleObject(ctx.data) ? ctx.data : { data: ctx.data };
    const body = isSimpleObject(ctx.body) ? ctx.body : { body: ctx.body };
    Object.setPrototypeOf(data, new function result() { });
    Object.setPrototypeOf(body, new function params() { });
    Object.setPrototypeOf(ctx, new function context() { });
    console.groupCollapsed(`%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${response.status} ${response.statusText} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${response.ok ? '#67C23A' : '#F56C6C'}; border-radius: 0 3px 3px 0;`,
    );
    console.log(body);
    console.log(data);
    console.log(ctx);
    console.groupEnd();
  }
]