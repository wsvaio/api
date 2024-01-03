import { merge, omit } from "@wsvaio/utils";
import type { AfterPatch, BasicContext, BeforeContext, BeforePatch, Requester } from "./types.d";

export function mergeContext(context: any, ...contexts: any[]) {
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

export function createContext<T extends Record<any, any>, B extends BeforePatch, A extends AfterPatch>(
  initial: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> } & T
) {
  return mergeContext(
    {
      method: "get",
      headers: {},
      log: false,

      path: "/",
      origin: "",

      query: {},
      body: null,
      param: {},

      startTime: new Date(),

      befores: [],
      afters: [],
      errors: [],
      finals: [],
    },
    initial
  ) as BeforeContext<B & T, A>;
}
