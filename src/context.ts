import { merge, omit } from "@wsvaio/utils";
import type { BeforeContext } from "./types";
export const createContext = (): BeforeContext => ({
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
});

export const mergeContext = (context1: Record<any, any>, context2: Record<any, any>) => {
  const keys = ["befores", "afters", "errors", "finals"];

  keys.forEach((key) => {
    !Array.isArray(context1[key]) && (context1[key] = []);
    Array.isArray(context2[key]) && context1[key].push(...context2[key]);
  });

  return merge(context1, omit(context2, keys), {
    deep: Infinity,
  });
};
