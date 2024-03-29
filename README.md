<center>

# @wsvaio/api

一个使用 TypeScript 编写，**通用**的网络请求库，主要用于处理 HTTP 请求

[![Size](https://img.shields.io/bundlephobia/minzip/@wsvaio/api/latest)](https://www.npmjs.com/package/@wsvaio/api) [![Version](https://img.shields.io/npm/v/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![Languages](https://img.shields.io/github/languages/top/wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![License](https://img.shields.io/npm/l/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![Star](https://img.shields.io/github/stars/wsvaio/api)](https://github.com/wsvaio/api) [![Download](https://img.shields.io/npm/dm/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api)

</center>

## 特性

- ✨ 通用的现代网络请求库，可以兼容多种环境
- 🎉 使用 TypeScript 编写，完善的类型支持
- 🎨 支持请求中间件，方便扩展功能
- 🎇 提供创建 API、设置全局上下文、执行请求等功能
- 🎏 支持合并上下文和配置，方便定制请求行为
- 🤖 内置实用中间件，如 URL 拼接、返回结果检查等
- 👾 支持日志输出，方便调试和查看请求情况
- 🐲 提供柯里化配置，优雅的封装接口
- 🐳 易于使用，帮助快速处理各种网络请求

## API

[document……](https://wsvaio.github.io/api/modules.html)

## 快速使用

### 安装

```
npm install @wsvaio/api
```

### 使用方法

首先，需要引入请求库：

```
import { createNativeFetchAPI } from "@wsvaio/api";
```

接下来，可以创建一个 API 实例：

```javascript
// 创建api实例并带有两个自定义属性
export const { post, get, put, patch, del, request, use } = createNativeFetchAPI<{
	success?: string; // 请求成功时的消息
	noticeable?: boolean; // 是否需要通知
}>({
	origin: "https://api.example.com",

	log: true,
	noticeable: true,
	headers: {
		// headers...
	},
	// 其他配置选项...
});
```

配置请求中间件：

```javascript
// before 请求发出前

use("before")(async () => Progress.start());

// 设置请求token
use("before")(async ctx => {
  const auth = useAuthStore();
  ctx.headers.Authorization = `Bearer ${auth.accessToken}`;
});

// after 请求发出后

// 抛出错误
use("after")(async ctx => {
  if (ctx.data?.code != 200) throw new Error(ctx.message);
});
// data扁平化
use("after")(async ctx => (ctx.data = ctx.data.data));

// error 错误处理

// 单独处理401
use("error")(async ctx => {
  if (ctx.data?.code != 401) return;
  // handle...
});

// final 收尾

use("final")(async ctx => Progress.done(!ctx.error));
// 通过扩展自定义属性实现通知
use("final")(async ctx =>
  ctx.error && ctx.noticeable
    ? ctx.message && ElNotification.error(ctx.message)
    : ctx.success && ElNotification.success(ctx.success)
);
```

您可以预先定义请求接口：

```javascript
// 简单定义
export const getUser = get("/user/:id");
export const addUser = post("/user");
// 或者传入一个对象
export const editUser = put({
  url: "/user/:id",
  param: { id: 1 }, // param参数
  body: { username: "oiavsw" },
  config: true, // config=false 将会执行
});
```

现在，可以使用 api 实例发起请求：

```javascript
// 直接发送请求
get({ url: "/users" }).then(data => {
	console.log(data);
});

// POST 请求
post({
	url: "/users",
	body: {
		name: "张三",
		age: 30,
	},
}).then(data => {
	console.log(data);
});

// 发送预先定义的请求
getUser({
	// 请求后显示通知
	noticeable: true,
	// 请求成功时的通知
	success: "获取成功"
	// param参数
	param: { id: 1 },
}).then(data => {
	// 响应
	console.log(data);
});

addUser({
	// body 参数
	body: {
		username: 'wsvaio'
	}
}).then(data => {
	// 响应
	console.log(data);
});

editUser();
```

## 通用性

通过提供不同的requester，可兼容不同的平台

内置：

- nativeFetchRequester //原生fetch
- uniappRequester // uniapp环境下的request，暂未实现
- nuxtFetchRequester // nuxt环境下的$fetch，暂未实现

例如要兼容uniapp，则可以使用uniappRequester

```ts
import { createAPI, uniappRequester } from "@wsvaio/api";

export const { get } = createAPI(uniappRequester)({
  origin: "http://localhost",
  log: true
});

get({
  q: { q1: 1 }
});
```

## 中间件

本请求库支持使用中间件来扩展功能。以下是一些示例：

### 请求前中间件

```javascript
api.use("before")(async ctx => {
  console.log("请求前");
});
```

### 请求后中间件

```javascript
api.use("after")(async ctx => {
  console.log("请求后");
});
```

### 错误处理中间件

```javascript
api.use("error")(async ctx => {
  console.log("错误处理");
});
```

### 最终处理中间件

```javascript
api.use("final")(async ctx => {
  console.log("最终处理");
});
```

## 柯里化配置

get、post 等http方法是柯里化的，可以无限递归，专门用于封装接口。必须设置 { config: true } 才会递归下去，否则将会执行请求

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get, request } = createAPI();
// 柯里化配置
const getTest1 = get({ url: "/test", config: true });
const getTest2 = get({ query: { q1: 1 }, config: true })({ param: { p1: 1 }, config: true })({
  body: { b1: 1 },
  config: true,
});
const getTest3 = get("/test"); // 相当于 { path: '/test', config: true }
// 发送请求
getTest1({ q: { p1: 1 } }).then(data => console.log(data));
getTest2({ q: { p2: 2 } }).then(data => console.log(data));
getTest3().then(data => console.log(data));
```

设置 { returnType: "context" } 将会返回context，默认返回context.data
``` ts
getTest1({ returnType: "context" }); // ctx
getTest1({ returnType: "data" }); // ctx.data
```

## Typescirpt

```typescript
// 泛型支持，可无限递归配置，对当前无影响，对递归的下一级有影响，后续则都为可选
// data 为特殊保留字段，不会作用，但会影响返回值的类型
const getUser = get<{
  body: {}; // 配置body类型
  query: {}; // 配置query类型
  param: {}; // 配置param类型
  data: {}; // 配置data返回结果
}>("/user");
// 支持递归
getUser<{
  body: {};
}>({  });
```

## 扩展、继承 API 实例

将要继承的ctx作为参数传入，即可扩展一个新的 API 实例：

```typescript
// 创建配置
import { createNativeFetchAPI } from "@wsvaio/api";
export const { ctx } = createNativeFetchAPI({
  baseURL: "/api",
});

// 继承父级的配置
const { get } = createNativeFetchAPI({
  ...ctx,
  other: {}
});

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

## 源码

源码可以在 [GitHub 仓库](https://github.com/wsvaio/api) 中找到。

## 贡献

如果您发现@wsvaio/api 中有任何问题或缺少某些功能，请随时提交问题或请求。

我们欢迎您的贡献，包括提交错误修复、添加新功能或改进文档。
