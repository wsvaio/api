import { createContext, mergeContext } from "./context";
import { exec } from "./executer";
import type { AfterC, BeforeContext, FinalContext, Requester } from "./types";

export function createAPI<B extends Record<any, any>, A extends AfterC | Promise<AfterC>>(
  requester: typeof Requester<B, A>
) {
  return {
    request: async (options: Partial<BeforeContext<B>>) => {
      const ctx = mergeContext(createContext(), { requester, ...options }) as BeforeContext;
      await exec(ctx);
      return ctx as FinalContext;
    },
  };
}

// const api = createAPI(nativeFetch);

// api.request({}).then(data => {
//   data.
// })
