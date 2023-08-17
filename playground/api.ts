import { createAPI } from "@wsvaio/api";

// 创建api对象 泛型添加自定义属性
export const { get, use, extendAPI } = createAPI<{
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
