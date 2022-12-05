import { trying, is } from "@wsvaio/utils";
import type { TContext } from "./types";
export const _befores: TContext["_befores"] = [
  // 超时中断请求
  async ctx => {
    if (!ctx.timeout || ctx.signal) return;
    const controller = new AbortController();
    ctx.signal = controller.signal;
    setTimeout(() => controller.abort(), ctx.timeout);
  },

  // 拼接请求url
  async ctx => {
    ctx.param ||= ctx.p;
    ctx.query ||= ctx.q;
    ctx.body ||= ctx.b;
    const url = new URL(ctx.url, "http://localhost");
    for (const [k, v] of Object.entries(ctx.query)) {
      Array.isArray(v) ? v.forEach(item => url.searchParams.append(k, item)) : url.searchParams.append(k, v);
    }
    const body = is("Object")(ctx.body) ? ctx.body : {};
    const keys = url.pathname.split("/").filter(item => item.startsWith(":")).map(item => item.substring(1));
    for (const key of keys) {
      const val = ctx.param[key] ?? body[key] ?? "";
      url.pathname = url.pathname.replace(new RegExp(`/:${key}\\??`, 'g'), val ? `/${val}` : val);
    }
    ctx.url = url.pathname + url.search + url.hash;
  },

  async ctx => {
    // 移除 GET/HEAD 请求方法的请求体
    if (["get", "head"].includes(ctx.method.toLowerCase())) ctx.body = null;
    // 添加Content-Type（因为要转换为JSON，fetch默认对字符串设置为text/plain）

    if (is("Object", "Array")(ctx.body)) await trying(() => {
      ctx.body = JSON.stringify(ctx.body);
      ctx.headers!["Content-Type"] = "application/json;charset=UTF-8";
    }).catch(() => { });
  },
]
