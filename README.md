# 一个fetch的简易包装
参考了koa express的中间件运行机制，将fetch请求设为【核心中间件】    
在其之前都为【前置中间件】，在其之后都为【后置中间件】  
并且在运行时使用了catch finall，所以可以配置【错误中间件】【最终中间件】    

## 快速使用
```typescript
import { createAPI } from "@wsvaio/api";
export const { get, use } = createAPI({
  baseURL: "/api",
});
use("before")(async ctx => {
  ctx.headers["auth"] = "...";
});
use("after")(async ctx => {
  console.log(ctx.data); // { code: 0, msg: 'success', data: 'xxxx' }
  ctx.data = ctx.data.data;
});

export const getTest = get("/user");

const data = getTest({ query: { id: 1 } }); // get: /api/user?id=1
console.log(data); // xxxx
```

## 配置预览
主要就一个ctx对象，所有中间件都围绕该对象操作  
使用createAPI创建时会创建一个ctx对象  
每次调用请求方法都会创建一个新的ctx对象，并且会合并createAPI创建时的配置  
只有createAPI创建的对象才有请求方法  
``` typescript
type middleware<T> = (ctx: T, next: () => Promise<void>) => Promise<any>;
// C：自定义配置，P：body、query、param属性的类型提示，R：响应内容的类型
type ctx<C extends object = {}, P extends object = {}, R=any> = {
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
  log: boolean; // 控制台是否打印日志；default=false
  timeout: number; // 请求超时的毫秒数；default=0
  url: string; // 请求地址；default="/"
  baseURL: string; // 请求根地址；default=""
  body: Partial<P> & Record<any, any> | BodyInit | null; // 请求体；default=null
  query: Partial<P> & Record<any, any>; // 请求的query参数，会自动拼接到url之后
  param: Partial<P> & Record<any, any>; // 请求的param参数，会自动替换url对应的/:key

  error?: Error; // 存储发生错误后的错误对象

  data: R; // 响应内容
  message: string; // 存储消息信息，比如发生错误后的error.message
  status: number; // 状态码
  response?: Response; // fetch的响应对象

  befores: middleware<ctx<C, P>>[]; // 前置中间件
  core: middleware<ctx<C, P>>; // 核心中间件，发送请求的中间件
  afters: middleware<ToRequired<ctx<C, P>, "response">>[]; // 后置中间件
  errors: middleware<ToRequired<ctx<C, P>, "error">>[]; // 错误中间件
  finals: middleware<ctx<C, P>>[]; // 最终中间件

  // 内置的一些中间件，封装一些通用的操作，比如拼接url参数，处理响应内容
  _befores: middleware<ctx<C, P>>[]; // 内置前置中间件
  _afters: middleware<ToRequired<ctx<C, P>, "response">>[]; // 内置后置中间件
  _errors: middleware<ToRequired<ctx<C, P>, "error">>[]; // 内置错误中间件
  _finals: middleware<ctx<C, P>>[]; // 内置最终中间件
} & C;
type ToRequired<T, K extends keyof T> =
  { [P in Exclude<keyof T, K>]: T[P]; }
  &
  { [P in K]-?: T[P] }
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
  befores: [
    async ctx => console.log("before"),
  ]
});

api.befores.push(
  async ctx => console.log("before"),
)

api.use("befores")(
  async ctx => console.log("before"),
)
```
2. 调用时配置
```typescript
const api = createAPI({
  method: "get",
  befores: [
    async ctx => console.log("before"),
  ]
});
// 中间件的配置不会覆盖创建时的配置，与创建时配置合并，其他配置则会覆盖，如method
api.request({ method: "post", befores: [
  async ctx => console.log("before"),
] })

```
### 运行机制
运行机制使用了洋葱模型  
前置、核心、后置中间件都在同一个执行列  
错误与最终中间件都是单独的执行列  
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
    // 下一个中间件执行完毕后执行
    console.log("before2 out");
  },
  async (ctx, next) => {
    // 没有调用next，之后的中间件都不会调用，将会直接到最终中间件
    console.log("before3");
  },
  async ctx => {
    console.log("before5");
    return Promise.reject("抛出错误"); // 遇到错误会跳到错误中间件
  },
)

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
// body、query、param暂不能单独配置，统一使用泛型P，配置较为宽松
type P = { id: number };
type R = { message: string };
const postTest = api.post<P, R>("/test/:id?");
const data = postTest({
  body: { id: 1 }, // 设置请求体
  param: { id: 1 }, // param会替换对应的/:key
  query: { id: 1 }, // query会拼接到url后
});
data.message;
```

