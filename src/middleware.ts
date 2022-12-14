import { trying, is, merge, dateFormat } from "@wsvaio/utils";
import { AfterContext, BeforeContext, ErrorContext, FinalContext, Middleware } from "./types";
export const befores: Middleware<BeforeContext>[] = [
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
      Array.isArray(v)
        ? v.forEach(item => url.searchParams.append(k, item))
        : url.searchParams.append(k, v as string);
    }
    const body = is("Object")(ctx.body) ? ctx.body : {};
    const keys = url.pathname
      .split("/")
      .filter(item => item.startsWith(":"))
      .map(item => item.substring(1));
    for (const key of keys) {
      const val = ctx.param[key] || body[key] || "";
      url.pathname = url.pathname.replace(new RegExp(`/:${key}\\??`, "g"), val ? `/${val}` : val);
    }
    ctx.url = url.pathname + url.search + url.hash;
  },

  async ctx => {
    // 移除 GET/HEAD 请求方法的请求体
    if (["get", "head"].includes(ctx.method.toLowerCase())) ctx.body = null;
    // 添加Content-Type（因为要转换为JSON，fetch默认对字符串设置为text/plain）
    if (is("Object", "Array")(ctx.body))
      await trying(() => {
        ctx.body = JSON.stringify(ctx.body);
        ctx.headers!["Content-Type"] = "application/json;charset=UTF-8";
      }).catch(() => { });

  },
];

export const core = async ctx => (ctx.response = await fetch(`${ctx.baseURL}${ctx.url}`, ctx));

export const afters: Middleware<AfterContext>[] = [
  async ctx => {
    // 恢复url
    ctx.url = decodeURI(ctx.url);
    // 尝试恢复body为json
    if (is("String")(ctx.body))
      ctx.body = await trying(() => JSON.parse(ctx.body as string)).catch(() => ctx.body);
  },
  // 设置data和dataType
  async ctx => {
    if (!ctx.response) return;
    if (ctx.dataType) return (ctx.data = await ctx.response[ctx.dataType]());
    const text = await ctx.response.text();
    ctx.data = await trying(() => JSON.parse(text)).catch(() => text);
    ctx.dataType = is("String")(ctx.data) ? "text" : "json";
  },
  // 抽取response信息
  async ctx => {
    if (!ctx.response) return;
    merge(ctx, {
      status: ctx.response.status,
      statusText: ctx.response.statusText,
      ok: ctx.response.ok,
      message: `请求${ctx.response.ok ? "成功" : "失败"}：${ctx.response.status} ${ctx.response.statusText
        }`,
    });

    // 抛出错误状态码
    if (!ctx.response.ok) throw new Error(ctx.message);
  },
];

export const errors: Middleware<ErrorContext>[] = [
  async (ctx, next) => {
    // AbortError AbortController触发 请求超时
    ctx.error.name == "AbortError"
      ? (ctx.message = `请求超时：${ctx.timeout}`)
      : (ctx.message = ctx.error.message);
    await next();
    throw ctx.error;
  },
];

export const finals: Middleware<FinalContext>[] = [
  async (ctx, next) => {
    await next();
    if (!ctx.log) return;
    const status = ctx.response ? `${ctx.status} ${ctx.statusText}` : `${ctx.message}`;
    const Params = Object.setPrototypeOf({}, new (function params() { })());
    const Result = Object.setPrototypeOf({}, new (function result() { })());
    const Context = Object.setPrototypeOf({}, new (function context() { })());
    merge(Params, is("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    merge(Result, is("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    merge(Context, ctx);
    console.groupCollapsed(
      `%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${status} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${ctx.ok ? "#67C23A" : "#F56C6C"
      }; border-radius: 0 3px 3px 0;`
    );
    console.log(Params);
    console.log(Result);
    console.log(Context);
    console.groupEnd();
  },
];
