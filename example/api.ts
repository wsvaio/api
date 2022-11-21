import { Progress } from "@wsvaio/utils";
import { createAPI } from "@wsvaio/api";

// 创建api对象 泛型添加自定义属性
export const { post, get, put, patch, del, request, use } = createAPI<{ success?: string; headers: Record<string, string>; }>({
  baseURL: "/api",
  log: true, // 控制台是否打印日志
  timeout: 0,
  headers: {

  },


});

use("befores")(async ctx => {
  console.log("befores", ctx);
})

use("afters")(async ctx => {
  console.log("afters", ctx);
})


