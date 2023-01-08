import type { Middleware } from "@wsvaio/utils";
export type { Middleware } from "@wsvaio/utils";

export type ResponseType<R = any> = {
  data: R;
  status: Response["status"];
  statusText: Response["statusText"];
  ok: Response["ok"];
  response: Response;
};

export type RequestType<B = {}, Q = {}, P = {}> = {
  method:
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "head"
  | "connect"
  | "trace";
  headers: HeadersInit;
  url: string;
  baseURL: string;

  body: B | BodyInit | null; // 请求体
  query: Q | null; // 请求的query参数，会自动拼接到url之后
  param: P | null; // 请求的param参数，会自动替换url对应的/:key

  b: B; // 与 body 相同，优先级低
  q: Q; // 与 query 相同，优先级低
  p: P; // 与 param 相同，优先级低
};

export type MiddlewareContext<C = {}, B = {}, Q = {}, P = {}, R = any> = {
  befores: Middleware<BeforeContext<C, B, Q, P, R>>[]; // 前置中间件
  core: Middleware<BeforeContext<C, B, Q, P, R>>; // 核心中间件，发送请求的中间件
  afters: Middleware<AfterContext<C, B, Q, P, R>>[]; // 后置中间件
  errors: Middleware<ErrorContext<C, B, Q, P, R>>[]; // 错误中间件
  finals: Middleware<FinalContext<C, B, Q, P, R>>[]; // 最终中间件
};

export type BaseContext = {
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

  log: boolean; // 控制台是否打印日志s
  timeout: number; // 请求超时的毫秒数
  message: string; // 存储消息信息，比如发生错误后的error.message

  dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
};

export type ConfigContext<C = {}, B = {}, Q = {}, P = {}, R = any> =
  Partial<
    BaseContext &
    MiddlewareContext<C, B, Q, P, R> &
    RequestType<B, Q, P> &
    C
  >;

export type BeforeContext<C = {}, B = {}, Q = {}, P = {}, R = any> =
  BaseContext &
  MiddlewareContext<C, B, Q, P, R> &
  RequestType<B, Q, P> &
  C;

export type AfterContext<C = {}, B = {}, Q = {}, P = {}, R = any> =
  BaseContext &
  MiddlewareContext<C, B, Q, P, R> &
  RequestType<B, Q, P> &
  ResponseType<R> &
  C;

export type ErrorContext<C = {}, B = {}, Q = {}, P = {}, R = any> =
  BaseContext &
  MiddlewareContext<C, B, Q, P, R> &
  RequestType<B, Q, P> &
  Partial<ResponseType<R>> &
  C & { error: Error };

export type FinalContext<C = {}, B = {}, Q = {}, P = {}, R = any> =
  BaseContext &
  MiddlewareContext<C, B, Q, P, R> &
  RequestType<B, Q, P> &
  Partial<ResponseType<R>> &
  C & { error?: Error };

/** 来自oak源码 */
export interface ParamsDictionary {
  [key: string]: string | number;
}

export type RemoveTail<
  S extends string,
  Tail extends string
> = S extends `${infer P}${Tail}` ? P : S;

export type GetRouteParams<S extends string> = RemoveTail<
  RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
  `.${string}`
>;

export type RouteParams<Route extends string> = string extends Route
  ? ParamsDictionary
  : Route extends `${string}(${string}`
  ? ParamsDictionary
  : Route extends `${string}:${infer Rest}`
  ? (GetRouteParams<Rest> extends never
    ? ParamsDictionary
    : GetRouteParams<Rest> extends `${infer ParamName}?`
    ? { [P in ParamName]?: string | number }
    : { [P in GetRouteParams<Rest>]: string | number }) &
  (Rest extends `${GetRouteParams<Rest>}${infer Next}`
    ? RouteParams<Next>
    : unknown)
  : ParamsDictionary;
/** 来自oak源码 */
