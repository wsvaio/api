import type { AfterPatch, BasicContext, BeforeContext, BeforePatch, Requester } from "./types";
import { mergeContext } from "./utils";

export const CTX = {
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
};

export function createContext<T extends Record<any, any>, B extends BeforePatch, A extends AfterPatch>(
  initial: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> } & T
) {
  return mergeContext({}, CTX, initial) as BeforeContext<B & T, A>;
}

export function setGlobalContext(ctx: Partial<Omit<BasicContext, "requester">>) {
  mergeContext(CTX, ctx);
}
