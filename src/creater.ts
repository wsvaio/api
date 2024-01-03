// import { createContext, mergeContext } from "./context";
// import { exec } from "./executer";
// import type { AfterC, BeforeContext, FinalContext, Requester } from "./types";

import type { AfterPatch, BasicContext, BeforePatch, Requester } from "./types";
import { createContext } from "./context";
import { currying } from "./wrapper";

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

export function createAPI<T extends Record<any, any>, B extends BeforePatch, A extends AfterPatch>(
  initial: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> } & T
) {
  const ctx = createContext(initial);
  const request = currying(ctx);
  // request(ctx)({ method: "" });

  return {
    ctx,
    use:
      <K extends "error" | "before" | "after" | "final">(key: K) =>
      (...args: Partial<Omit<BasicContext<B, A>, "requester">>[]) =>
        ctx[`${key}s`].push(...args),

    request,

    // @ts-expect-error pass
    get: request({ method: "get", config: true }),
    // @ts-expect-error pass
    put: request({ method: "put", config: true }),
    // @ts-expect-error pass
    post: request({ method: "post", config: true }),
    // @ts-expect-error pass
    del: request({ method: "delete", config: true }),
    // post: request({ method: "post", config: true }),
    // put: request({ method: "put", config: true }),
    // patch: request({ method: "patch", config: true }),
    // ge1t: request({ config: true, method: "", }),
    // get: request({ method: "get", config: true }),
    // get: request({ method: "get", config: true }),
    // get: request({ method: "get", config: true }),
    // get: request({ method: "get", config: true }),
  };
}
