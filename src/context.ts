import type { AfterPatch, BasicContext, BeforeContext, BeforePatch, Requester } from "./types";
import { mergeContext } from "./utils";

export function createContext<T extends Record<any, any>, B extends BeforePatch, A extends AfterPatch>(
  initial: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> } & T
) {
  return mergeContext(
    {
      method: "get",
      headers: {},
      log: false,

      path: "/",
      base: "",

      query: {},
      body: null,
      param: {},

      befores: [],
      afters: [],
      errors: [],
      finals: [],
    },
    initial
  ) as BeforeContext<B & T, A>;
}
