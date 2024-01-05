import type { AfterPatch, BeforeContext, BeforePatch, Requester } from "./types";
import { nativeFetchRequester } from "./requester";
import { currying } from "./wrapper";
import { createContext } from "./context";

// export function createAPI<T extends Record<any, any>, B extends BeforePatch, A extends AfterPatch>(
//   initial: Partial<Omit<BasicContext<B, A>, "requester">> & { requester: typeof Requester<B, A> } & T
// ) {
//   const ctx = createContext<T, B, A>(initial);
//   const request = currying(ctx);

//   return {
//     ctx,
//     use:
//       <K extends "error" | "before" | "after" | "final">(key: K) =>
//       (...args: BasicContext<B & T, A>[`${K}s`]) => {
//         // @ts-expect-error pass
//         ctx[`${key}s`].push(...args);
//         console.log(ctx, key);
//       },

//     request,
//     get: request({ method: "get", config: true }),
//     post: request({ method: "post", config: true }),
//     put: request({ method: "put", config: true }),
//     patch: request({ method: "patch", config: true }),
//     del: request({ method: "delete", config: true }),
//     head: request({ method: "head", config: true }),
//     connect: request({ method: "connect", config: true }),
//     trace: request({ method: "trace", config: true }),
//     options: request({ method: "options", config: true }),
//   };
// }

export function createAPI<B extends BeforePatch, A extends AfterPatch>(requester: typeof Requester<B, A>) {
  return <T extends Record<any, any>>(initial: Partial<BeforeContext<B, A>> & T) => {
    const ctx = createContext<T, B, A>({ ...initial, requester });
    const request = currying(ctx);

    return {
      ctx,
      use:
        <K extends "error" | "before" | "after" | "final">(key: K) =>
        (...args: BeforeContext<B & T, A>[`${K}s`]) => {
          // @ts-expect-error pass
          ctx[`${key}s`].push(...args);
          console.log(ctx, key);
        },

      request,
      get: request({ method: "get", config: true }),
      post: request({ method: "post", config: true }),
      put: request({ method: "put", config: true }),
      patch: request({ method: "patch", config: true }),
      del: request({ method: "delete", config: true }),
      head: request({ method: "head", config: true }),
      connect: request({ method: "connect", config: true }),
      trace: request({ method: "trace", config: true }),
      options: request({ method: "options", config: true }),
    };
  };
}

export const createNativeFetchAPI = createAPI(nativeFetchRequester);
