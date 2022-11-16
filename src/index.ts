import { toString, trying, dateFormat } from "@wsvaio/utils";

import { merge } from "./merge";

type middleware<T> = (ctx: T, next: () => Promise<void>) => Promise<any>;


type ctx<custom extends object = {}, params extends object = {}> = {
  cache: RequestCache;
  credentials: RequestCredentials;
  headers: HeadersInit;
  integrity: string;
  keepalive: boolean;
  method: string;
  mode: RequestMode;
  redirect: RequestRedirect;
  referrer: string;
  referrerPolicy: ReferrerPolicy;
  signal: AbortSignal | null;
  window: null;

  log: boolean;
  timeout: number;
  url: string;
  baseURL: string;
  body: Partial<params> & Record<string, any> | BodyInit;
  query: Partial<params> & Record<string, any>;
  param: Partial<params> & Record<string, any>;

  error: Error;
  data: any;
  message: string;
  status: number;
  response: Response;


  before: middleware<payload<custom, params>>[];
  core: middleware<payload<custom, params>>;
  after: middleware<payload<custom, params>>[];

  catch: middleware<payload<custom, params>>[];
  finally: middleware<payload<custom, params>>[];

  // 执行器
  actuator: (ctx: payload<custom, params>, ...middleware: middleware<payload<custom, params>>[]) => Promise<payload<custom, params>>;

  // 发送请求
  request: <T extends ctx<Partial<custom>, params> | undefined = undefined>(str?: T) => T extends undefined ? Promise<payload<custom, params>> : payload<custom, params>["request"];

} & custom;

type ToRequired<T, K extends keyof T> =
  { [P in Exclude<keyof T, K>]: T[P]; }
  &
  { [P in K]-?: T[P] }

type payload<custom extends object = {}, params extends object = {}> = ToRequired<
  ctx<custom, params>,
  "headers" | "query" | "param" | "method" | "before"
  | "core" | "after" | "catch" | "finally" | "actuator" | "request"
>

export const createAPI = <custom extends object = {}>(ctx = <ctx<custom>>{}) => <payload<custom>>merge<ctx>(<ctx>ctx, {
  headers: {},
  query: {},
  param: {},
  method: "get",
  before: [
    // 超时中断请求
    async ctx => {
      if (!ctx.timeout) return;
      const controller = new AbortController();
      ctx.signal = controller.signal;
      setTimeout(() => controller.abort(), ctx.timeout);
    },
    // 拼接请求url
    async ctx => {
      const { query, param } = ctx;
      const url = new URL(ctx.url ?? "", "http://localhost");
      if (query) for (const [k, v] of Object.entries(query)) {
        if (Array.isArray(v)) {
          for (const item of v) {
            url.searchParams.append(k, item);
          }
        } else url.searchParams.append(k, v);
      }
      const body = toString(ctx.body) == "[object Object]" ? ctx.body! : {};
      const keys = url.pathname.split("/").filter(item => item.startsWith(":")).map(item => item.substring(1));
      for (const key of keys) {
        const val = param![key] ?? body[key] ?? "";
        url.pathname = url.pathname.replace(new RegExp(`/:${key}\\??`, 'g'), val ? `/${val}` : val);
      }
      ctx.url = url.pathname + url.search + url.hash;
    },
    // 添加Content-Type（因为要转换为JSON，fetch默认对字符串设置为text/plain）
    async ctx => {
      if (!["[object Object]", "[object Array]"].includes(toString(ctx.body))) return;
      await trying(() => {
        ctx.body = JSON.stringify(ctx.body);
        ctx.headers!["Content-Type"] = "application/json;charset=UTF-8";
      }).catch(() => { });
    }
  ],
  // 发送请求，核心中间件
  core: async ctx => ctx.response = await fetch((ctx.baseURL || "") + ctx.url, <object>ctx),
  after: [
    async ctx => {
      if (!["[object String]"].includes(toString(ctx.body))) return;
      ctx.body = await trying(() => JSON.parse(<string>ctx.body)).catch(() => ctx.body);
    },
    // 格式化结果
    async ctx => {
      const text = await ctx.response!.text();
      const data = await trying(() => JSON.parse(text)).catch(() => text);
      merge(ctx, { data, status: ctx.response!.status });
      ctx.message = `请求${ctx.response!.ok ? '成功' : '失败'}：${ctx.response!.status} ${ctx.response!.statusText}`;
    },
    // 抛出错误状态码
    async ctx => ctx?.response?.ok || Promise.reject(ctx)
  ],
  catch: [
    async (ctx, next) => {
      // AbortError AbortController触发 请求超时
      ctx.message = ctx.error!.message;
      ctx?.error?.name == "AbortError" ? (ctx.message = `请求超时：${ctx.timeout}`) : ctx.message = ctx?.error?.message;
      await next();
      // 总会抛出错误
      return Promise.reject(ctx);
    }
  ],
  // 打印日志
  finally: [
    async ctx => {
      if (!ctx.log) return;
      ctx.response ||= <Response>{ ok: false, status: 400, statusText: "Bad Request" };
      ctx.body ||= {};
      ctx.data ||= { message: ctx.message };
      const data = (typeof ctx.data != "object" || Array.isArray(ctx.data)) ? { data: ctx.data } : ctx.data;
      Object.setPrototypeOf(data, new function result() { });
      Object.setPrototypeOf(ctx.body, new function params() { });
      Object.setPrototypeOf(ctx, new function context() { });
      console.groupCollapsed(`%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${ctx.response.status} ${ctx.response.statusText} `,
        "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
        "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
        "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
        `font-size: 16px; font-weight: 100; color: white; background: ${ctx.response.ok ? '#67C23A' : '#F56C6C'}; border-radius: 0 3px 3px 0;`,
      );
      console.log(ctx.body);
      console.log(data);
      console.log(ctx);
      console.groupEnd();
    }
  ],

  // 执行器，默认洋葱模型
  actuator: async (ctx, ...middleware) => {
    let index = -1;
    await (async function next() {
      if (++index >= middleware.length) return;
      const auto = middleware[index].length <= 1;
      await middleware[index](ctx, next);
      auto && await next();
    })();
    return ctx;
  },
  request: (context) => {
    const payload = <payload<custom>>ctx;
    payload.actuator()
    if (context) {
      merge<any>(payload, context, { deep: Infinity });
      return <any>payload.request;
    }
    else return payload.actuator(payload, ...payload.before, payload.core, ...payload.after)
      .catch(async err => {
        payload.error = err;
        return await payload.actuator(payload, ...payload.catch);
      })
      .finally(async () => {
        await payload.actuator(payload, ...payload.finally);
      })
  }
}, { deep: Infinity });

