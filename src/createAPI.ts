import type { BaseContext, ConfigContext, MiddlewareContext } from "./types";
import { createContext, mergeContext } from "./context";
import { request } from "./request";

export const createAPI = <C extends object = {}>(config = {} as ConfigContext & C) => {
  const context: Record<any, any> = createContext();
  mergeContext(context, config);

  return {
    get: request<C>(context)("get"),
    post: request<C>(context)("post"),
    put: request<C>(context)("put"),
    patch: request<C>(context)("patch"),
    del: request<C>(context)("delete"),
    head: request<C>(context)("head"),
    connect: request<C>(context)("connect"),
    trace: request<C>(context)("trace"),
    options: request<C>(context)("options"),
    request: request<C>(context)()(),
    extendAPI: <C1 extends object = {}>(config1 = {} as ConfigContext & C1 & Partial<C>) => {
      const context1: Record<any, any> = createContext();
      mergeContext(context1, context);
      mergeContext(context1, config1);
      return createAPI(context1);
    },
    use:
      <K extends "befores" | "afters" | "errors" | "finals">(key: K) =>
      (...args: MiddlewareContext<C>[K]) =>
        context[key].push(...args),
  };
};

export const run = <T extends BaseContext>(ctx: T) => request({})()()(ctx);
