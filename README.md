<center>

# @wsvaio/api

[![Size](https://img.shields.io/bundlephobia/minzip/@wsvaio/api/latest)](https://www.npmjs.com/package/@wsvaio/api) [![Version](https://img.shields.io/npm/v/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![Languages](https://img.shields.io/github/languages/top/wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![License](https://img.shields.io/npm/l/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![Star](https://img.shields.io/github/stars/wsvaio/api)](https://github.com/wsvaio/api) [![Download](https://img.shields.io/npm/dm/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api)

</center>

## 快速使用

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI();
// 发送请求
get({ url: "/test" });
```

## 中间件

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get, use } = createAPI();

// 中间件
// 前置
use("before")(async ctx => {
  ctx.headers.Authorization = "token";
});
// 后置
use("after")(async ctx => {
  if (ctx.data.code != 200) throw Error();
});
// 错误
use("error")(async ctx => {
  console.log(ctx.error);
});
// 最终
use("final")(async ctx => {
  console.log(ctx);
});

// 发送请求
get({ url: "/test" });
```

## 发送请求

```typescript
// query & param & body
// 简写
get({ q: {}, p: {}, b: {} });
// 全写，优先级高，并且body支持更多类型
get({ query: {}, param: {}, body: {} });
```

## Typescirpt

```typescript
// 泛型支持
type Params = { filed1: string };
type Result = { code: number; data: any; msg: string };
const result = await get<Params, Result>({ b: {}, q: {}, p: {} });
// Params 可以为body query param提供类型提示
// Result 可以设置result的类型
```

## 柯里化配置

只要传入 config = true，请求就不会调用，可继续柯里化配置  
配置项可以是一个字符串，该字符串会被赋值给 ctx.url，并且将 ctx.config 视为 true  
配置隔离，不会发生污染

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI();
// 柯里化配置
const getTest1 = get({ url: "/test", config: true });
const getTest2 = getTest2({ q: { p1: 1 }, config: true });
const getTest3 = get("/test");
// 发送请求
getTest1({ q: { p1: 1 } });
getTest2({ q: { p2: 2 } });
getTest3();
// or
get({ q: {}, config: true })({ p: {}, config: true })({ b: {}, config: true })();
// or
get("/test/:id")({ p: { id: 1 } }); // get /test/1
```

## 派生配置

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { extendAPI } = createAPI({
  baseURL: "/api",
});

// 派生配置，继承父级的配置
const { get } = extendAPI();

// 发送请求
get({ url: "/test" });
```

## 日志打印

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI({
  log: true, // 日志打印
});
```

## 超时中断请求

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get } = createAPI({
  timeout: 5000, // 超时中断请求
});
```
