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

use("before")(async () => {
	console.log("before");
});

use("after")(async () => {
	console.log("after");
});

use("error")(async () => {
	console.log("error");
});
use("final")(async () => {
	console.log("final");
});

post<{ q: { id: number }; d: string }>({})({
	q: { id: 1 },
	befores: [
		async ctx => {
			console.log("啊？");
		}
	]
}).then(data => {

});
