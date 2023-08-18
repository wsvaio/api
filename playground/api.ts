import { createAPI } from "@wsvaio/api";

// 创建api对象 泛型添加自定义属性
export const { get, use, extendAPI, post, request } = createAPI<{
	success?: string;
	headers: Record<string, string>;
}>({
	baseURL: "/api",
	log: true, // 控制台是否打印日志
	timeout: 0,
	headers: {},
});

use("before")(async ctx => {
	console.log("before");
});

use("after")(async ctx => {
	console.log("after");
	console.log(ctx.data);
});

use("error")(async () => {
	console.log("error");
});
use("final")(async () => {
	console.log("final");
});
