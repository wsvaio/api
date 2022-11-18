import { trying, toString, dateFormat, merge, isSimpleObject } from "@wsvaio/utils";


export const _befores: ctx["_befores"] = [
  // 超时中断请求
  async ctx => {
    if (!ctx.timeout || ctx.signal) return;
    const controller = new AbortController();
    ctx.signal = controller.signal;
    setTimeout(() => controller.abort(), ctx.timeout);
  },


  // 拼接请求url
  async ctx => {
    const { query, param } = ctx;
    const url = new URL(ctx.url, "http://localhost");
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
      const val = param[key] ?? body[key] ?? "";
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
  },



  // 移除 GET/HEAD 请求方法的请求体
  async ctx => {
    if (!["get", "head"].includes(ctx.method.toLowerCase())) return;
    ctx.body = null;
  }
]



export const core: ctx['core'] = async ctx => ctx.response = await fetch(`${ctx.baseURL}${ctx.url}`, <RequestInit>ctx);



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




export const _errors: ctx["_errors"] = [
  async (ctx, next) => {
    // AbortError AbortController触发 请求超时
    ctx.message = ctx.error.message;
    ctx?.error?.name == "AbortError" ? (ctx.message = `请求超时：${ctx.timeout}`) : ctx.message = ctx?.error?.message;
    await next();
    // 总会抛出错误
    return Promise.reject(ctx);
  }
]





export const _finals: ctx["_finals"] = [
  async ctx => {
    if (!ctx.log) return;
    const response = ctx.response || { ok: false, status: 100, statusText: "Continue" };
    const data = isSimpleObject(ctx.data) ?  ctx.data : { data: ctx.data };
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

export const init = {
  method: "get",
  headers: {},
  log: false,
  timeout: 0,
  url: "/",
  baseURL: "",
  body: {},
  query: {},
  param: {},

  befores: [],
  core,
  afters: [],
  errors: [],
  finals: [],

  _befores,
  _afters,
  _errors,
  _finals,
  

  data: {},
  message: "Continue",
  status: 100
}
