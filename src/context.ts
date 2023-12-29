import { merge, omit } from "@wsvaio/utils";
import type { BeforeContext } from "./types.d";

export function mergeContext(context: Record<any, any>, ...contexts: Record<any, any>[]) {
  const keys = ["befores", "afters", "errors", "finals"] as const;
  keys.forEach(key => {
    !Array.isArray(context[key]) && (context[key] = []);
    contexts
      .filter(item => !!item)
      .forEach(item => {
        Array.isArray(item[key]) && context[key].push(...item[key]);
        merge(context, omit(item, [...keys]), {
          deep: Number.POSITIVE_INFINITY,
        });
      });
  });
  return context;
}

export function createContext(): BeforeContext {
  return {
    method: "get",
    headers: {},
    log: false,

    baseURL: "",
    url: "/",

    requester: {} as any,

    query: {},
    body: null,
    param: {},

    startTime: new Date(),

    befores: [],
    afters: [],
    errors: [],
    finals: [],
  };
}
