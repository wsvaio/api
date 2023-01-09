import { Progress } from "@wsvaio/utils";
import { createAPI } from "@wsvaio/api";

// 创建api对象 泛型添加自定义属性
export const { post, get, put, patch, del, use, r } = createAPI<{
  success?: string;
  headers: Record<string, string>;
}>({
  baseURL: "/api",
  log: true, // 控制台是否打印日志
  timeout: 0,
  headers: {},
});

use("befores")(async ctx => {
  console.log("befores");
});

use("afters")(async ctx => {
  console.log("afters");
});

use("errors")(async ctx => {
  console.log("errors");
});

use("finals")(async ctx => {
  console.log("finals");
});


const a = r("get");
const b = a("/a/b/:c?/:d?");
const c = b({ p: {} });

const testt = get<{ a: number, b: string }, { c: number }>("/a/b/:c?/:d?");
testt({ p: {}, b: {}, q: {} }).then(data => {
  data;
});