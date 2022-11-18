global {
  type middleware<T> = (ctx: T, next: () => Promise<void>) => Promise<any>;

  type ctx<C extends object = {}, P extends object = {}, R=any> = {
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

    method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
    headers: HeadersInit;
    log: boolean;
    timeout: number;
    url: string;
    baseURL: string;
    body: Partial<P> & Record<any, any> | BodyInit | null;
    query: Partial<P> & Record<any, any>;
    param: Partial<P> & Record<any, any>;

    error?: Error;
    data: R;
    message: string;
    status: number;
    response?: Response;


    befores: middleware<ctx<C, P>>[];
    core: middleware<ctx<C, P>>;
    afters: middleware<ToRequired<ctx<C, P>, "response">>[];
    errors: middleware<ToRequired<ctx<C, P>, "error">>[];
    finals: middleware<ctx<C, P>>[];

    _befores: middleware<ctx<C, P>>[];
    _afters: middleware<ToRequired<ctx<C, P>, "response">>[];
    _errors: middleware<ToRequired<ctx<C, P>, "error">>[];
    _finals: middleware<ctx<C, P>>[];

  } & C;

  type ToRequired<T, K extends keyof T> =
    { [P in Exclude<keyof T, K>]: T[P]; }
    &
    { [P in K]-?: T[P] }
}

export { }