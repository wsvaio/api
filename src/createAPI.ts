import type { ConfigContext, Context, CreateAPIResult, MiddlewareContext } from "./types";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

export const createAPI = <C extends object = {}>(
  config = {} as ConfigContext & C,
): CreateAPIResult => {
  const context = mergeContext(createContext(), config) as Context<C>;
  return {
    get: wrapper<C>(context)("get"),
    post: wrapper<C>(context)("post"),
    put: wrapper<C>(context)("put"),
    patch: wrapper<C>(context)("patch"),
    del: wrapper<C>(context)("delete"),
    head: wrapper<C>(context)("head"),
    connect: wrapper<C>(context)("connect"),
    trace: wrapper<C>(context)("trace"),
    options: wrapper<C>(context)("options"),
    request: wrapper<C>(context)(),
    extendAPI: <Custom extends object = {}>(config1 = {} as ConfigContext & Partial<C> & Custom) =>
      createAPI(mergeContext(mergeContext(createContext(), context), config1)),
    use:
      <K extends "before" | "after" | "error" | "final">(key: K) =>
      (...args: MiddlewareContext<C>[`${K}s`]) =>
        context[`${key}s`].push(...args),
  };
};
