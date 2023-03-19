import { merge, omit } from "@wsvaio/utils";
import type { Context, MiddlewareContext } from "./types";
const CONTEXT: Context = {
  method: "get",
  headers: {},
  log: false,
  timeout: 0,
  url: "/",
  baseURL: "",

  b: {},
  q: {},
  p: {},

  query: null,
  body: null,
  param: null,

  befores: [],
  afters: [],
  errors: [],
  finals: [],

  message: "",
};

export const mergeContext = (context1: Context, context2: Context) => {
  const keys: (keyof MiddlewareContext)[] = ["befores", "afters", "errors", "finals"];

  keys.forEach((key) => {
    !Array.isArray(context1[key]) && (context1[key] = []);
    Array.isArray(context2[key]) && context1[key].push(...context2[key]);
  });

  return merge(context1, omit(context2, keys), {
    deep: Infinity,
  });
};

export const createContext = (): Context => mergeContext({}, CONTEXT);

export const setGlobalContext = <C extends object = {}>(config: Context<C>) => mergeContext(CONTEXT, config);
