// import { createContext, mergeContext } from "./context";
// import { exec } from "./executer";
// import type { AfterC, BeforeContext, FinalContext, Requester } from "./types";

import { createContext, mergeContext } from "./context";
import { exec } from "./executer";
import type { AfterC, BasicContext, BeforeContext, Requester } from "./types";

// // export function createAPI<B extends Record<any, any>, A extends AfterC | Promise<AfterC>>(
// //   requester: typeof Requester<B, A>
// // ) {
// //   return {
// //     request: async (options: Partial<BeforeContext<B>>) => {
// //       const ctx = mergeContext(createContext(), { requester, ...options }) as BeforeContext;
// //       await exec(ctx);
// //       return ctx as FinalContext;
// //     },
// //   };
// // }

// export function createAPI<B extends Record<any, any>, A extends AfterC>(
//   initial: B & { requester: typeof Requester<B, A> }
// ) {
//   return {
//     request: async (options: Partial<BeforeContext<B>>) => {
//       const ctx = mergeContext(createContext(), initial, options) as BeforeContext;
//       await exec(ctx);
//       return ctx as FinalContext<B & A>;
//     },
//   };
// }

// // const api = createAPI(nativeFetch);

// // api.request({}).then(data => {
// //   data.
// // })

export function createAPI<T extends Record<any, any>, B extends Record<any, any>, A extends AfterC>(
  initial: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> } & T
) {
  const ctx = createContext(initial);

  return {
    ctx,
    use:
      <K extends "error" | "before" | "after" | "final">(key: K) =>
      (...args: Partial<Omit<BasicContext<B, A>, "requester">>[]) =>
        ctx[`${key}s`].push(...args),

    request: async (options: Partial<BeforeContext<B>>) => {
      return exec(mergeContext({}, ctx, initial, options));
    },
  };
}
