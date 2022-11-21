declare type TMiddleWare<T> = (ctx: T, next: () => Promise<void>) => Promise<any>;

// C：自定义配置，P：body、query、param属性的类型提示，R：响应内容的类型
declare type ctx<C extends object = {}, P extends object = {}, R = any> = {
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


  befores: TMiddleWare<ctx<C, P>>[]; // 前置中间件
  core: TMiddleWare<ctx<C, P>>; // 核心中间件，发送请求的中间件
  afters: TMiddleWare<ToRequired<ctx<C, P>, "response">>[]; // 后置中间件
  errors: TMiddleWare<ToRequired<ctx<C, P>, "error">>[]; // 错误中间件
  finals: TMiddleWare<ctx<C, P>>[]; // 最终中间件

  // 内置的一些中间件，封装一些通用的操作，比如拼接url参数，处理响应内容
  _befores: TMiddleWare<ctx<C, P>>[]; // 内置前置中间件
  _afters: TMiddleWare<ToRequired<ctx<C, P>, "response">>[]; // 内置后置中间件
  _errors: TMiddleWare<ToRequired<ctx<C, P>, "error">>[]; // 内置错误中间件
  _finals: TMiddleWare<ctx<C, P>>[]; // 内置最终中间件

} & C;

declare type ToRequired<T, K extends keyof T> =
  { [P in Exclude<keyof T, K>]: T[P]; }
  &
  { [P in K]-?: T[P] }


declare type TCreateAPIParamType<T extends object = {}> = Partial<ctx> & T;
declare type TCreateAPIReturnType<T extends object = {}> = ctx<T> & {
  get: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  post: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  put: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  patch: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  del: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  head: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  connect: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  trace: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  options: <params extends object = {}, result extends object = {}>(conf1?: string | Partial<ctx<T, params, result>>) => <P extends object = params, R extends object = result>(conf2?: Partial<ctx<T, P, R>>) => Promise<R>;
  request: <P_1 extends object = {}, R_1 extends object = {}>(conf2?: Partial<ctx<T, P_1, R_1>>) => Promise<R_1>;
  use: <K extends "befores" | "afters" | "errors" | "finals">(key: K) => (...args: ctx<T, {}, any>[K]) => number;
};

export { ctx, TCreateAPIParamType, TCreateAPIReturnType, TMiddleWare, ToRequired };