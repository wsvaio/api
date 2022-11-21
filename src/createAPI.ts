import { merge } from "@wsvaio/utils";
import { method } from "./method";
import { init } from "./init";
import type { TContext, TCreateAPIParamType, TCreateAPIReturnType } from "./types";
export const createAPI = <T extends object = {}>(context: TCreateAPIParamType<T>): TCreateAPIReturnType<T> => {
  const ctx = <TContext<T>>merge(<any>context || {}, init, { overwrite: false });


  return {
    ...ctx,
    get: method<T>(ctx)("get"),
    post: method<T>(ctx)("post"),
    put: method<T>(ctx)("put"),
    patch: method<T>(ctx)("patch"),
    del: method<T>(ctx)("delete"),
    head: method<T>(ctx)("head"),
    connect: method<T>(ctx)("connect"),
    trace: method<T>(ctx)("trace"),
    options: method<T>(ctx)("options"),
    request: method<T>(ctx)()(),

    // @ts-ignore
    use: <K extends "befores" | "afters" | "errors" | "finals">(key: K) => (...args: TContext<T>[K]) => ctx[key].push(...args)
  }
}

