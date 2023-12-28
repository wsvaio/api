import type { Middleware } from "@wsvaio/utils";

export type CTX<B, A = Record<any, any>> = {
  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
  headers: Record<any, any>;
  url: string;
  baseURL: string;

  body: Record<any, any> | BodyInit | null;
  query: Record<any, any> | null;
  param: Record<any, any> | null;

  log: boolean;

  befores: Middleware<CTX<B>>[];
  afters: Middleware<CTX<B, A>>[];
  errors: Middleware<CTX<B, A> & { error: Error }>[];
  finals: Middleware<CTX<B, Partial<A>> & { error?: Error }>[];
} & B &
  A;

export const createApi = <Before extends Record<any, any>, After extends Record<any, any>>(
  core: (before: Before) => After
) => ({} as CTX<Before, After>);

const api = createApi((before: { a: number }) => {
  return { 666: "wdf" };
});

api.errors.push(async ctx => {


});
