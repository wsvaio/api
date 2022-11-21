import { trying, toString, merge } from "@wsvaio/utils";
import { ctx } from "./env";
export const _afters: ctx["_afters"] = [
  async ctx => {
    if (!["[object String]"].includes(toString(ctx.body))) return;
    ctx.body = await trying(() => JSON.parse(<string>ctx.body)).catch(() => ctx.body);
  },
  // 格式化结果
  async ctx => {
    if (!ctx.response) return;
    const text = await ctx.response.text();
    const data = await trying(() => JSON.parse(text)).catch(() => text);
    merge(ctx, {
      data,
      status: ctx.response.status,
      message: `请求${ctx.response.ok ? '成功' : '失败'}：${ctx.response.status} ${ctx.response.statusText}`
    });
    // 抛出错误状态码
    return ctx.response.ok || Promise.reject(ctx);
  },
]