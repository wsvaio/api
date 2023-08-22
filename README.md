<center>

# @wsvaio/api

一个使用 TypeScript 编写，基于 fetch 的网络请求库，主要用于处理 HTTP 请求

[![Size](https://img.shields.io/bundlephobia/minzip/@wsvaio/api/latest)](https://www.npmjs.com/package/@wsvaio/api) [![Version](https://img.shields.io/npm/v/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![Languages](https://img.shields.io/github/languages/top/wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![License](https://img.shields.io/npm/l/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api) [![Star](https://img.shields.io/github/stars/wsvaio/api)](https://github.com/wsvaio/api) [![Download](https://img.shields.io/npm/dm/@wsvaio/api)](https://www.npmjs.com/package/@wsvaio/api)

</center>

## 特性

- ✨ 基于 fetch 的现代网络请求库
- 🎉 使用 TypeScript 编写，提供类型支持
- 🎨 支持请求中间件，方便扩展功能
- 🎇 提供创建 API、设置全局上下文、执行请求等功能
- 🎏 支持合并上下文和配置，方便定制请求行为
- 🤖 内置实用中间件，如 URL 拼接、返回结果检查等
- 👾 支持日志输出，方便调试和查看请求情况
- 🐲 提供柯里化配置，优雅的封装接口
- 🐋 支持超时中断请求
- 🐳 易于使用，帮助快速处理各种网络请求

## API

[document……](https://wsvaio.github.io/api/modules.html)

## 安装

```
npm install @wsvaio/api
```

## 使用方法

首先，需要引入请求库：

```
import { createAPI } from '@wsvaio/api';
```

接下来，可以创建一个 API 实例：

```javascript
// 创建api实例并带有两个自定义属性
export const { post, get, put, patch, del, request, use, extendAPI } = createAPI<{
	success?: string; // 请求成功时的消息
	noticeable?: boolean; // 是否需要通知
}>({
	baseURL: "https://api.example.com",

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
	p: { id: 1 }, // 自带参数 p为param的简写
	b: { username: "oiavsw" },
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
	p: { id: 1 },
}).then(data => {
	// 响应
	console.log(data);
});

addUser({
	// body 参数
	b: {
		username: 'wsvaio'
	}
}).then(data => {
	// 响应
	console.log(data);
});

editUser();
```

## Query & Param & Body

```typescript
// 简写
get({ q: {}, p: {}, b: {} });
// 全写，优先级高，并且body支持更多类型
get({ query: {}, param: {}, body: {} });
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

get、post 等方法是柯里化的，有两层，专门用于封装接口；request 可以直接调用发送请求；

```typescript
// 创建配置
import { createAPI } from "@wsvaio/api";
export const { get, request } = createAPI();
// 柯里化配置
const getTest1 = get({ url: "/test" });
const getTest2 = get({ q: { p1: 1 } });
const getTest3 = get("/test");
// 发送请求
getTest1({ q: { p1: 1 } }).then(data => console.log(data));
getTest2({ q: { p2: 2 } }).then(data => console.log(data));
getTest3().then(data => console.log(data));
// request 直接发送请求
request({ url: "/test", q: { id: 1 } }).then(data => console.log(data));
```

## Typescirpt

```typescript
// 泛型支持
const getUser = get<{
	b: {}; // 配置body类型
	q: {}; // 配置query类型
	p: {}; // 配置param类型
	d: {}; // 配置data返回结果
}>("/user");
// D 配置data返回结果（覆盖之前的）
const result = await getUser<D>({ b: {}, q: {}, p: {} });
```

## 扩展 API 实例

使用 extendAPI() 方法扩展一个新的 API 实例：

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

## 源码

源码可以在 [GitHub 仓库](https://github.com/wsvaio/api) 中找到。

## 贡献

如果您发现@wsvaio/api 中有任何问题或缺少某些功能，请随时提交问题或请求。

我们欢迎您的贡献，包括提交错误修复、添加新功能或改进文档。
