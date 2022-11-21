import { trying, toString } from "@wsvaio/utils";

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
