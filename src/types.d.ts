import type { DeepPartial, Middleware, IsEqual, IsOptional } from "@wsvaio/utils";
export type { Middleware };

export interface ResponseType<D = any> {
	data: D;
	status: Response["status"];
	statusText: Response["statusText"];
	ok: Response["ok"];
	response: Response & { data: any };
}

export interface RequestType<B = Record<any, any>, Q = Record<any, any>, P = Record<any, any>> {
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

	body: Record<any, any> | BodyInit | null;
	query: Record<any, any> | null;
	param: Record<any, any> | null;

	b: B & Record<any, any>;
	q: Q & Record<any, any>;
	p: P & Record<any, any>;
}

export type BasicContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = {
	log: boolean;
	timeout: number;
	message: string;

	// 是否正常，用于normailze方法
	normal: boolean;

	// response解析方式
	dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";

	befores: Middleware<BeforeContext<C, B, Q, P, D>>[];
	afters: Middleware<AfterContext<C, B, Q, P, D>>[];
	errors: Middleware<ErrorContext<C, B, Q, P, D>>[];
	finals: Middleware<FinalContext<C, B, Q, P, D>>[];
} & C;

export type BeforeContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P>;

export type AfterContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & ResponseType<D>;

export type ErrorContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & Partial<ResponseType<D>> & { error: Error };

export type FinalContext<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & Partial<ResponseType<D>> & { error?: Error };

export type Context<
	C = Record<any, any>,
	B = Record<any, any>,
	Q = Record<any, any>,
	P = Record<any, any>,
	D = any
> = Partial<BasicContext<C, B, Q, P, D> & RequestType<B, Q, P> & ResponseType<D> & { error: Error }>;

export type WrapperResult<C> = <
	T extends {
		b?: Record<any, any>;
		q?: Record<any, any>;
		p?: Record<any, any>;
		d?: any;
	} = {
		b?: Record<any, any>;
		q?: Record<any, any>;
		p?: Record<any, any>;
		d: any;
	},
	B = IsEqual<T["b"], unknown> extends true ? Record<any, any> : T["b"],
	Q = IsEqual<T["q"], unknown> extends true ? Record<any, any> : T["q"],
	P = IsEqual<T["p"], unknown> extends true ? Record<any, any> : T["p"],
	D = IsEqual<T["d"], unknown> extends true ? any : T["d"]
>(
	config1: (Context<C, B, Q, P, D> & DeepPartial<Omit<T, "d">>) | string
) => IsOptional<Omit<T, "d">, keyof Omit<T, "d">> extends true
	? <Data = D>(config2?: Context<C, B, Q, P, Data> & Omit<T, "d">) => Promise<Data>
	: <Data = D>(config2: Context<C, B, Q, P, Data> & Omit<T, "d">) => Promise<Data>;

export interface CreateAPIResult<C extends Record<any, any>> {
	get: WrapperResult<C>;
	post: WrapperResult<C>;
	put: WrapperResult<C>;
	patch: WrapperResult<C>;
	del: WrapperResult<C>;
	head: WrapperResult<C>;
	connect: WrapperResult<C>;
	trace: WrapperResult<C>;
	options: WrapperResult<C>;
	request: <D>(config?: Context<C>) => Promise<D>;
	extendAPI: <T extends Record<any, any>>(config?: Context<T & C>) => CreateAPIResult<T & C>;
	use: <K extends "error" | "before" | "after" | "final">(key: K) => (...args: Context<C>[`${K}s`]) => number;
}
