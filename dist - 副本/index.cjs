var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  createAPI: () => createAPI,
  run: () => run,
  setGlobalContext: () => setGlobalContext
});
module.exports = __toCommonJS(src_exports);

// src/context.ts
var import_utils = require("@wsvaio/utils");
var CONTEXT = {};
var mergeContext = (context1, context2) => {
  const keys = ["befores", "afters", "errors", "finals"];
  keys.forEach((key) => {
    !Array.isArray(context1[key]) && (context1[key] = []);
    Array.isArray(context2[key]) && context1[key].push(...context2[key]);
  });
  return (0, import_utils.merge)(context1, (0, import_utils.omit)(context2, keys), {
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
var import_utils3 = require("@wsvaio/utils");

// src/middleware.ts
var import_utils2 = require("@wsvaio/utils");
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
    const body = (0, import_utils2.is)("Object")(ctx.body) ? ctx.body : {};
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
    if ((0, import_utils2.is)("Object", "Array")(ctx.body)) {
      await (0, import_utils2.trying)(() => {
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
    if ((0, import_utils2.is)("String")(ctx.body))
      ctx.body = await (0, import_utils2.trying)(() => JSON.parse(ctx.body)).catch(() => ctx.body);
  },
  // 设置data和dataType
  async (ctx) => {
    if (!ctx.response)
      return;
    if (ctx.dataType)
      return ctx.data = await ctx.response[ctx.dataType]();
    const text = await ctx.response.text();
    ctx.response.data = ctx.data = await (0, import_utils2.trying)(() => JSON.parse(text)).catch(() => text);
    ctx.dataType = (0, import_utils2.is)("String")(ctx.data) ? "text" : "json";
  },
  // 抽取response信息
  async (ctx) => {
    if (!ctx.response)
      return;
    (0, import_utils2.merge)(ctx, {
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
    (0, import_utils2.merge)(Params, (0, import_utils2.is)("Object")(ctx.body) ? ctx.body : { body: ctx.body });
    (0, import_utils2.merge)(Result, (0, import_utils2.is)("Object")(ctx.data) ? ctx.data : { data: ctx.data });
    (0, import_utils2.merge)(Context, ctx);
    console.groupCollapsed(
      `%c ${(0, import_utils2.dateFormat)(Date.now())} %c ${ctx.method} %c ${ctx.url} %c ${status} `,
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
var run = (ctx) => (0, import_utils3.compose)(
  ...ctx.befores,
  ...BEFORES
)(ctx).then(() => MIDDLE(ctx)).then(() => (0, import_utils3.compose)(...AFTERS, ...ctx.afters)(ctx)).catch((error) => (0, import_utils3.compose)(...ERRORS, ...ctx.errors)((0, import_utils3.merge)(ctx, { error }))).finally(() => (0, import_utils3.compose)(...FINALS, ...ctx.finals)(ctx));
var wrapper = (context) => (method) => currying({ ...context, method });
function currying(context) {
  function result(config = {}) {
    const ctx = mergeContext(createContext(), context);
    if (typeof config === "string")
      config = { url: config, config: true };
    mergeContext(ctx, (0, import_utils3.omit)(config, ["config"]));
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createAPI,
  run,
  setGlobalContext
});
