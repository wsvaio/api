import { createAPI } from "@wsvaio/api";

// 创建api对象 泛型添加自定义属性
export const { post, get, put, patch, del, use, extendAPI } = createAPI<{
  success?: string;
  headers: Record<string, string>;
}>({
  baseURL: "/api",
  log: true, // 控制台是否打印日志
  timeout: 0,
  headers: {},
});

// use("before")(async (ctx) => {
//   console.log("before");
// });

// use("before")(async (ctx) => {
//   console.log("before");
// });

// use("before")(async (ctx) => {
//   console.log("before");
// });

// use("after")(async (ctx) => {
//   console.log("after");
// });

// use("error")(async (ctx) => {
//   console.log("error");
// });

// use("final")(async (ctx) => {
//   console.log("final");
// });

export const extendedAPI = extendAPI({
  baseURL: "/ipa",
  befores: [
    async (ctx) => {
      console.log("jfaklsdjflkasjdkfljaslkdjflkasdjfklasjd;flakjsd", ctx);
    },
  ],

});

// extendedAPI.use("before")(async (ctx) => {
//   console.log("extendedAPI before");
// });

// extendedAPI.use("before")(async (ctx) => {
//   console.log("extendedAPI before");
// });

// extendedAPI.use("before")(async (ctx) => {
//   console.log("extendedAPI before");
// });

// extendedAPI.get("/wdf/:id")();

export const test1 = extendedAPI.get("/wdf/:id?/:di??abc=1&cba=2");
