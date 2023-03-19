# 一个对 fetch 的封装库

## 快速使用

```typescript
import { createAPI } from "@wsvaio/api";
export const { get, use } = createAPI({
  baseURL: "/api",
});
use("befores")(async ctx => {
  ctx.headers["auth"] = "...";
});
use("afters")(async ctx => {
  console.log(ctx.data); // { code: 0, msg: 'success', data: 'xxxx' }
  ctx.data = ctx.data.data;
});

export const getTest = get("/user");

const data = await getTest({ query: { id: 1 } }); // get: /api/user?id=1
console.log(data); // xxxx
```

## 中间件

### 中间件有四种类型

1. before: 前置中间件，请求发出前调用
2. after: 后置中间件，请求发出后调用
3. error: 错误中间件，发生错误时调用
4. final: 最终中间件，最后才会调用

### 配置中间件

1. 创建时配置

```typescript
export const api = createAPI({
  befores: [async ctx => console.log("before")],
});
api.use("befores")(async ctx => console.log("before"));
```

2. 调用时配置

```typescript
const api = createAPI({
  method: "get",
  befores: [async ctx => console.log("before")],
});
// 中间件的配置不会覆盖创建时的配置，与创建时配置合并，其他配置则会覆盖，如method
api.request({ method: "post", befores: [async ctx => console.log("before")] });
```

### 运行机制

运行机制使用了洋葱模型

```typescript
export const api = createAPI();

api.use("befores")(
  async ctx => {
    // 没有接收next参数会自动调用next
    console.log("before1");
  },
  async (ctx, next) => {
    // 接受了next参数需要手动调用next才能执行下一个中间件
    console.log("before2 in");
    await next();
    // 后续中间件执行完毕后执行
    console.log("before2 out");
  },
  async (ctx, next) => {
    // 接受了next参数，没有调用next，之后的中间件都不会调用
    console.log("before3");
  },
);
```

## 发送请求

```typescript
const api = createAPI();

// api.request方法会直接调用，其它请求方法需要调用两次，方便配置
// 先配置再调用
const getTest = api.get("/test");
getTest({ query: { id: 1 } });
// 直接发送请求
api.request({ url: "/test", query: { id: 1 } });

// 泛型支持，P：body、query、param属性的类型提示，R：响应内容的类型
type P = { id: number };
type R = { message: string };
const postTest = api.post<P, R>("/test/:id?");
const data = await postTest({
  body: { id: 1 }, // 设置请求体
  param: { id: 1 }, // param会替换对应的/:key
  query: { id: 1 }, // query会拼接到url后

  // b、p、q等同body、param、query，优先级比它们低，b只能接受对象类型，body可以接受FormData、ArrayBuffer、Blob等复杂类型；
  b: {},
  p: {},
  q: {},
});
```

## Context

完整的 Context 包括以下属性

```typescript
type Context = {
  // fetch配置
  cache?: RequestCache;
  credentials?: RequestCredentials;
  integrity?: string;
  keepalive?: boolean;
  mode?: RequestMode;
  redirect?: RequestRedirect;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  signal?: AbortSignal | null;
  window?: null;
  // 以上为fetch配置

  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
  headers: HeadersInit;
  log: boolean; // 控制台是否打印日志
  timeout: number; // 请求超时的毫秒数
  url: string; // 请求地址
  baseURL: string; // 请求根地址

  body: Record<any, any> | BodyInit | null; // 请求体
  query: Record<any, any> | null; // 请求的query参数，会自动拼接到url之后
  param: Record<any, any> | null; // 请求的param参数，会自动替换url对应的/:key

  b: Record<any, any>; // 与 body 相同，优先级低
  q: Record<any, any>; // 与 query 相同，优先级低
  p: Record<any, any>; // 与 param 相同，优先级低

  error: Error; // 存储发生错误后的错误对象

  data: R; // 响应内容
  dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text"; // response 解析返回值的方式，默认先解析为text，再尝试解析成json
  status: Response["status"];
  statusText: Response["statusText"];
  ok: Response["ok"];
  response: Response; // 发送请求后的响应对象

  message: string; // 存储消息信息，比如发生错误后的error.message

  befores: Middleware[]; // 前置中间件
  core: Middleware; // 核心中间件，发送请求的中间件
  afters: Middleware[]; // 后置中间件
  errors: Middleware[]; // 错误中间件
  finals: Middleware[]; // 最终中间件
};
```
