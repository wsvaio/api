// 创建api对象 泛型添加自定义属性
// export const { get, use, extendAPI, post, request } = createAPI<{
// 	success?: string;
// 	headers: Record<string, string>;
// }>({
// 	baseURL: "/api",
// 	log: true, // 控制台是否打印日志
// 	timeout: 0,
// 	headers: {},
// });

import { createAPI, nativeFetchRequester } from "@wsvaio/api";

// use("before")(async ctx => {
// 	console.log("before");
// });

// use("after")(async ctx => {
// 	console.log("after");
// 	console.log(ctx.data);
// });

// use("error")(async () => {
// 	console.log("error");
// });
// use("final")(async () => {
// 	console.log("final");
// });

// get<{ b?: { a?: number }; q?: { a?: number } }>({
// 	afters: [async ctx => {}],
// })().then(data => {
// 	console.log(data);
// });

export const api = createAPI({
  requester: nativeFetchRequester,
  timeout: 0,
  dataType: "json",
  a: 6,
});

api.request({ method: "connect" });
// api{}.
api.post({ method: "connect", config: true, })({ });

// const ctx = createContext({
//   requester: nativeFetchRequester,
//   // a: 1,
//   // ''
//   a: 1,
// });

// ctx.requester().then(data => data.)
// ctx.aA extends AfterC
// ctx.requester().then(data => data);
