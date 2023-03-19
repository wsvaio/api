import type { ConfigContext, Context, CreateAPIResult, MiddlewareContext } from "./types";
import { createContext, mergeContext } from "./context";
import { request } from "./request";

export const createAPI = <C extends object = {}>(config = {} as ConfigContext & C): CreateAPIResult => {
  const context = mergeContext(createContext(), config) as Context<C>;
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
    request: request<C>(context)(),
    extendAPI: <Custom extends object = {}>(config1 = {} as ConfigContext & Partial<C> & Custom) =>
      createAPI(mergeContext(mergeContext(createContext(), context), config1)),
    use:
      <K extends "before" | "after" | "error" | "final">(key: K) =>
      (...args: MiddlewareContext<C>[`${K}s`]) =>
        context[`${key}s`].push(...args),
  };
};
