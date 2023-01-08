import { ConfigContext, MiddlewareContext } from "./types";
import { befores, afters, errors, finals } from "./middleware";
import { createContext, mergeContext } from "./context";
import { request } from "./request";

export const createAPI = <C extends object = {}>(config = {} as ConfigContext & C) => {
  const context: Record<any, any> = createContext();
  mergeContext(context, { befores, afters, errors, finals });
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
    use:
      <K extends "befores" | "afters" | "errors" | "finals">(key: K) =>
        (...args: MiddlewareContext<C>[K]) =>
          context[key].push(...args),
  };
};
