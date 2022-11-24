export type TMiddleWare<T> = (TContext: T, next: () => Promise<void>) => Promise<any>;

// C：自定义配置，P：body、query、param属性的类型提示，R：响应内容的类型
export type TContext<C extends object = {}, P extends object = {}, R = any> = {
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
  headers: HeadersInit;
  log: boolean; // 控制台是否打印日志；default=false
  timeout: number; // 请求超时的毫秒数；default=0
  url: string; // 请求地址；default="/"
  baseURL: string; // 请求根地址；default=""
  body: Partial<P> & Record<any, any> | BodyInit | null; // 请求体；default=null
  query: Partial<P> & Record<any, any>; // 请求的query参数，会自动拼接到url之后
  param: Partial<P> & Record<any, any>; // 请求的param参数，会自动替换url对应的/:key

  error?: Error; // 存储发生错误后的错误对象
  data: R; // 响应内容
  message: string; // 存储消息信息，比如发生错误后的error.message
  status: number; // 状态码
  response?: Response; // fetch的响应对象


  befores: TMiddleWare<TContext<C, P>>[]; // 前置中间件
  core: TMiddleWare<TContext<C, P>>; // 核心中间件，发送请求的中间件
  afters: TMiddleWare<ToRequired<TContext<C, P>, "response">>[]; // 后置中间件
  errors: TMiddleWare<ToRequired<TContext<C, P>, "error">>[]; // 错误中间件
  finals: TMiddleWare<TContext<C, P>>[]; // 最终中间件

  // 内置的一些中间件，封装一些通用的操作，比如拼接url参数，处理响应内容
  _befores: TMiddleWare<TContext<C, P>>[]; // 内置前置中间件
  _afters: TMiddleWare<ToRequired<TContext<C, P>, "response">>[]; // 内置后置中间件
  _errors: TMiddleWare<ToRequired<TContext<C, P>, "error">>[]; // 内置错误中间件
  _finals: TMiddleWare<TContext<C, P>>[]; // 内置最终中间件

} & C;

export type ToRequired<T, K extends keyof T> =
  { [P in Exclude<keyof T, K>]: T[P]; }
  &
  { [P in K]-?: T[P] }


export type TMethod<T extends object = {}> = <params extends object = {}, result extends object = any>(conf1?: string | Partial<TContext<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<TContext<T, P, R>>) => Promise<R>;

export type TCreateAPIParamType<T extends object = {}> = Partial<TContext> & T;
export type TCreateAPIReturnType<T extends object = {}> = TContext<T> & {
  get: TMethod<T>;
  post: TMethod<T>;
  put: TMethod<T>;
  patch: TMethod<T>;
  del: TMethod<T>;
  head: TMethod<T>;
  connect: TMethod<T>;
  trace: TMethod<T>;
  options: TMethod<T>;
  request: <P_1 extends object = {}, R_1 extends object = {}>(conf2?: Partial<TContext<T, P_1, R_1>>) => Promise<R_1>;
  use: <K extends "befores" | "afters" | "errors" | "finals">(key: K) => (...args: TContext<T, {}, any>[K]) => number;
};
