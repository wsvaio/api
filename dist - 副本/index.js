// src/context.ts
import { merge, omit } from "@wsvaio/utils";
var CONTEXT = {};
var mergeContext = (context1, context2) => {
  const keys = ["befores", "afters", "errors", "finals"];
  keys.forEach((key) => {
    !Array.isArray(context1[key]) && (context1[key] = []);
    Array.isArray(context2[key]) && context1[key].push(...context2[key]);
  });
  return merge(context1, omit(context2, keys), {
    deep: Infinity
  });
};
var createContext = () => mergeContext(
  {
    method: "get",
    headers: {},
    log: false,
    timeout: 0,
    url: "/",
    baseURL: "",
    b: {},
    q: {},
    p: {},
    query: null,
    body: null,
    param: null,
    befores: [],
    afters: [],
    errors: [],
    finals: [],
    message: ""
  },
  CONTEXT
);
var setGlobalContext = (config) => mergeContext(CONTEXT, config);

// src/request.ts
import { compose, merge as merge3, omit as omit2 } from "@wsvaio/utils";

// src/middleware.ts
import { dateFormat, is, merge as merge2, trying } from "@wsvaio/utils";
var BEFORES = [
  // 超时中断请求
  async (ctx) => {
    if (!ctx.timeout || ctx.signal)
      return;
    const controller = new AbortController();
    ctx.signal = controller.signal;
    setTimeout(() => controller.abort(), ctx.timeout);
  },
  // 拼接请求url
  async (ctx) => {
    ctx.param ||= ctx.p;
    ctx.query ||= ctx.q;
    ctx.body ||= ctx.b;
    const body = is("Object")(ctx.body) ? ctx.body : {};
    ctx.url.match(/:[\w_][\w\d_]*\??/gims)?.forEach((matched) => {
      const key = matched.slice(1, matched.length - (matched.endsWith("?") ? 1 : 0));
      const val = ctx.param[key] || body[key] || "";
      if (!val && !matched.endsWith("?"))
        return;
      ctx.url = ctx.url.replace(matched, val);
    });
    ctx.url = ctx.url.replace(/\/+/gims, "/");
    ctx.url += ctx.url.includes("?") ? "&" : "?";
    Object.entries(ctx.query).forEach(
      ([k, v]) => Array.isArray(v) ? v.forEach((item) => ctx.url += `${k}=${item}&`) : ![null, void 0, ""].includes(v) && (ctx.url += `${k}=${v}&`)
    );
    ctx.url = ctx.url.substring(0, ctx.url.length - 1);
  },
  async (ctx) => {
    if (["get", "head"].includes(ctx.method.toLowerCase()))
      ctx.body = null;
    if (is("Object", "Array")(ctx.body)) {
      await trying(() => {
        ctx.body = JSON.stringify(ctx.body);
        ctx.headers["Content-Type"] = "application/json;charset=UTF-8";
      }).catch(() => {
      });
    }
  }
];
var MIDDLE = async (ctx) => ctx.response = await fetch(`${ctx.baseURL}${ctx.url}`, ctx);
var AFTERS = [
  async (ctx) => {
    if (is("String")(ctx.body))
      ctx.body = await trying(() => JSON.parse(ctx.body)).catch(() => ctx.body);
  },
  // 设置data和dataType
  async (ctx) => {
    if (!ctx.response)
      return;
    if (ctx.dataType)
      return ctx.data = await ctx.response[ctx.dataType]();
    const text = await ctx.response.text();
    ctx.response.data = ctx.data = await trying(() => JSON.parse(text)).catch(() => text);
    ctx.dataType = is("String")(ctx.data) ? "text" : "json";
  },
  // 抽取response信息
  async (ctx) => {
    if (!ctx.response)
      return;
    merge2(ctx, {
      status: ctx.response.status,
      statusText: ctx.response.statusText,
      ok: ctx.response.ok,
      message: `\u8BF7\u6C42${ctx.response.ok ? "\u6210\u529F" : "\u5931\u8D25"}\uFF1A${ctx.response.status} ${ctx.response.statusText}`
    });
    if (!ctx.response.ok)
      throw new Error(ctx.message);
  }
];
var ERRORS = [
  async (ctx, next) => {
    ctx.error.name == "AbortError" ? ctx.message = `\u8BF7\u6C42\u8D85\u65F6\uFF1A${ctx.timeout}` : ctx.message = ctx.error.message;
    await next();
    if (ctx.error)
      throw ctx;
  }
];
var FINALS = [
  async (ctx, next) => {
    await next();
    if (!ctx.log)
      return;
    const status = ctx.response ? `${ctx.status} ${ctx.statusText}` : `${ctx.message}`;
    const Params = Object.setPrototypeOf({}, new function params() {
    }());
    const Result = Object.setPrototypeOf({}, new function result() {
    }());
    const Context = Object.setPrototypeOf({}, new function context() {
    }());
    merge2(Params, is("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    merge2(Result, is("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    merge2(Context, ctx);
    console.groupCollapsed(
      `%c ${dateFormat(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${status} `,
      "font-size: 16px; font-weight: 100; color: white; background: #909399; border-radius: 3px 0 0 3px;",
      "font-size: 16px; font-weight: 100; color: white; background: #E6A23C;",
      "font-size: 16px; font-weight: 100; color: white; background: #409EFF;",
      `font-size: 16px; font-weight: 100; color: white; background: ${ctx.ok ? "#67C23A" : "#F56C6C"}; border-radius: 0 3px 3px 0;`
    );
    console.log(Params);
    console.log(Result);
    console.log(Context);
    console.groupEnd();
  }
];

// src/request.ts
var run = (ctx) => compose(
  ...ctx.befores,
  ...BEFORES
)(ctx).then(() => MIDDLE(ctx)).then(() => compose(...AFTERS, ...ctx.afters)(ctx)).catch((error) => compose(...ERRORS, ...ctx.errors)(merge3(ctx, { error }))).finally(() => compose(...FINALS, ...ctx.finals)(ctx));
var wrapper = (context) => (method) => currying({ ...context, method });
function currying(context) {
  function result(config = {}) {
    const ctx = mergeContext(createContext(), context);
    if (typeof config === "string")
      config = { url: config, config: true };
    mergeContext(ctx, omit2(config, ["config"]));
    return config?.config ? currying(ctx) : run(ctx).then(() => ctx.data);
  }
  return result;
}

// src/createAPI.ts
var createAPI = (config = {}) => {
  const context = mergeContext(createContext(), config);
  return {
    get: wrapper(context)("get"),
    post: wrapper(context)("post"),
    put: wrapper(context)("put"),
    patch: wrapper(context)("patch"),
    del: wrapper(context)("delete"),
    head: wrapper(context)("head"),
    connect: wrapper(context)("connect"),
    trace: wrapper(context)("trace"),
    options: wrapper(context)("options"),
    request: wrapper(context)(),
    extendAPI: (config1 = {}) => createAPI(mergeContext(mergeContext(createContext(), context), config1)),
    use: (key) => (...args) => context[`${key}s`].push(...args)
  };
};
export {
  createAPI,
  run,
  setGlobalContext
};
