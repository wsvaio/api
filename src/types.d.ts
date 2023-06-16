import type { Middleware } from "@wsvaio/utils";
export type { Middleware };
/**
 * 定义响应类型
 * @template R 响应数据类型
 */
export interface ResponseType<R = any> {
	data: R;
	status: Response["status"];
	statusText: Response["statusText"];
	ok: Response["ok"];
	response: Response & { data: any };
}
/**
 * 定义请求类型
 * @template P 请求参数类型
 */
export interface RequestType<P = {}> {
	// fetch配置
	cache?: RequestCache;
	credentials?: RequestCredentials;
	integrity?: string;
	keepalive?: boolean;
	mode?: RequestMode;
	redirect?: RequestRedirect;
	referrer?: string;
	referrerPolicy?: ReferrerPolicy;
	signal?: AbortSignal | null;
	window?: null;
	// 以上为fetch配置

	method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
	headers: Record<any, any>;
	url: string;
	baseURL: string;

	body: (Partial<P> & Record<any, any>) | BodyInit | null;
	query: (Partial<P> & Record<any, any>) | null;
	param: (Partial<P> & Record<any, any>) | null;

	b: Partial<P> & Record<any, any>;
	q: Partial<P> & Record<any, any>;
	p: Partial<P> & Record<any, any>;
}
/**
 * 中间件上下文
 * @template C 上下文类型
 * @template P 请求参数类型
 * @template R 响应数据类型
 */
export interface MiddlewareContext<C = {}, P = {}, R = any> {
	befores: Middleware<BeforeContext<C, P, R>>[]; // 请求前中间件
	afters: Middleware<AfterContext<C, P, R>>[]; // 请求后中间件
	errors: Middleware<ErrorContext<C, P, R>>[]; // 请求错误中间件
	finals: Middleware<FinalContext<C, P, R>>[]; // 请求结束中间件
}
/**
 * 基础上下文类型
 */
export interface BaseContext {
	log: boolean;
	timeout: number;
	message: string;

	dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
}

/**
 * 配置上下文类型
 * @template C 上下文类型
 * @template P 请求参数类型
 * @template R 响应数据类型
 */
export type ConfigContext<C = {}, P = {}, R = any> = Partial<
	BaseContext & MiddlewareContext<C, P, R> & RequestType<P> & C
>;
/**
 * 请求前中间件上下文类型
 * @template C 上下文类型
 * @template P 请求参数类型
 * @template R 响应数据类型
 */
export type BeforeContext<C = {}, P = {}, R = any> = BaseContext & MiddlewareContext<C, P, R> & RequestType<P> & C;
/**
 * 请求后中间件上下文类型
 * @template C 上下文类型
 * @template P 请求参数类型
 * @template R 响应数据类型
 */
export type AfterContext<C = {}, P = {}, R = any> = BaseContext &
	MiddlewareContext<C, P, R> &
	RequestType<P> &
	ResponseType<R> &
	C;
/**
 * 请求错误中间件上下文类型
 * @template C 上下文类型
 * @template P 请求参数类型
 * @template R 响应数据类型
 */
export type ErrorContext<C = {}, P = {}, R = any> = BaseContext &
	MiddlewareContext<C, P, R> &
	RequestType<P> &
	Partial<ResponseType<R>> &
	C & { error: Error };
/**
 * 请求结束中间件上下文类型
 * @template C 上下文类型
 * @template P 请求参数类型
 * @template R 响应数据类型
 */
export type FinalContext<C = {}, P = {}, R = any> = BaseContext &
	MiddlewareContext<C, P, R> &
	RequestType<P> &
	Partial<ResponseType<R>> &
	C & { error?: Error };

/**
 * 上下文类型
 * @template C 上下文类型
 */
export type Context<C = {}> = Partial<FinalContext<C>>;

/**
 * CurryingResult 类型定义，用于表示柯里化后的函数返回类型。
 * @template C 上下文类型
 * @template Param 请求参数类型
 * @template Result 响应数据类型
 */
export interface CurryingResult<C, Param extends object = {}, Result = any> {
	/**
	 * 用于支持链式调用的方法。
	 * @template P 新的请求参数类型
	 * @template R 新的响应数据类型
	 * @param config 配置对象，包含 config 属性设置为 true 或者传入字符串
	 * @returns 返回一个新的 CurryingResult 实例，支持进一步的链式调用
	 */
	<P extends object = {}, R = Result>(
		config: (ConfigContext<C, P & Param, R> & { config: true }) | string
	): CurryingResult<C, P & Param, R>;

	/**
	 * 用于执行请求并返回 Promise 的方法。
	 * @template P 请求参数类型
	 * @template R 响应数据类型
	 * @param config 可选的配置对象
	 * @returns 返回一个 Promise，当请求成功时，Promise 将解析为响应数据类型 R 的值
	 */
	<P extends object = {}, R = Result>(config?: ConfigContext<C, P & Param, R> & { config?: false }): Promise<R>;
}
/**
 * 创建API函数的返回类型
 * @template C 上下文类型
 */
export interface CreateAPIResult<C extends object = {}> {
	/**
	 * GET 请求方法
	 */
	get: CurryingResult<C, {}, any>;

	/**
	 * POST 请求方法
	 */
	post: CurryingResult<C, {}, any>;

	/**
	 * PUT 请求方法
	 */
	put: CurryingResult<C, {}, any>;

	/**
	 * PATCH 请求方法
	 */
	patch: CurryingResult<C, {}, any>;

	/**
	 * DELETE 请求方法
	 */
	del: CurryingResult<C, {}, any>;

	/**
	 * HEAD 请求方法
	 */
	head: CurryingResult<C, {}, any>;

	/**
	 * CONNECT 请求方法
	 */
	connect: CurryingResult<C, {}, any>;

	/**
	 * TRACE 请求方法
	 */
	trace: CurryingResult<C, {}, any>;

	/**
	 * OPTIONS 请求方法
	 */
	options: CurryingResult<C, {}, any>;

	/**
	 * 自定义请求方法
	 */
	request: CurryingResult<C, {}, any>;

	/**
	 * 扩展 API 方法，用于创建具有自定义配置的新 API 实例
	 * @param config1 可选的自定义配置对象
	 */
	extendAPI: <Custom extends object = {}>(
		config1?: ConfigContext & Partial<C> & Custom
	) => CreateAPIResult<Partial<C> & Custom>;
	/**
	 * 使用中间件
	 * @param key 中间件类型，包括 "error"、"before"、"after" 和 "final"
	 */
	use: <K extends "error" | "before" | "after" | "final">(
		key: K
	) => (...args: MiddlewareContext<C, {}, any>[`${K}s`]) => number;
}
