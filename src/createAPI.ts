import type { Context, CreateAPIResult } from "./types.d";
import { createContext, mergeContext } from "./context";
import { wrapper } from "./request";

import type { Middleware } from "@wsvaio/utils";

export const createAPI = <C extends Record<any, any>>(config = {} as Context<C>): CreateAPIResult<C> => {
  const context = mergeContext(createContext(), config);
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
    request: wrapper<C>(context)("get")({}),
    extendAPI: config => createAPI(mergeContext(createContext(), context, config)),
    use:
      key =>
      (...args) =>
        context[`${key}s`].push(...args),
  };
};

export type CTX<B, A = Record<any, any>> = {
  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
  headers: Record<any, any>;
  url: string;
  baseURL: string;

  body: Record<any, any> | BodyInit | null;
  query: Record<any, any> | null;
  param: Record<any, any> | null;

  log: boolean;

  befores: Middleware<CTX<B>>[];
  afters: Middleware<CTX<B, A>>[];
  errors: Middleware<CTX<B, A> & { error: Error }>[];
  finals: Middleware<CTX<B, Partial<A>> & { error?: Error }>[];
} & B & A;

export const createApi = <Before extends Record<any, any>, After extends Record<any, any>>(
  core: (before: Before) => After
) => ({} as CTX<Before, After>);

const api = createApi((before: { a: number }) => {
  return { 666: 'wdf' };
});



api.errors.push(async (ctx) => {

})


