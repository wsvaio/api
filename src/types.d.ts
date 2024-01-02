import type { Middleware } from "@wsvaio/utils";

export type { Middleware };

type IgnoreKeys =
  | "method"
  | "headers"
  | "path"
  | "origin"
  | "body"
  | "query"
  | "param"
  | "log"
  | "befores"
  | "afters"
  | "errors"
  | "finals";

export function Requester<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC>(
  ctx: CoreContext<B, A>
): Promise<A>;

export type BasicContext<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC> = {
  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
  headers: Record<any, any>;

  origin: string;
  path: string;

  body: Record<any, any> | BodyInit | null;
  query: Record<any, any>;
  param: Record<any, any>;

  log: boolean;

  startTime: Date;

  // response解析方式
  dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";

  befores: Middleware<BasicContext<B, A>>[];
  requester: typeof Requester<B, A>;
  afters: Middleware<AfterContext<B, A>>[];
  errors: Middleware<ErrorContext<B, A>>[];
  finals: Middleware<FinalContext<B, A>>[];
} & Omit<B, IgnoreKeys>;

export interface BeforeC {
  fullPath: string;
  url: string;
}
export interface AfterC {
  // ok: boolean;
  status: number;
  message: string;
  data: any;
}
export interface ErrorC {
  error: Error;
}

export interface FinalC {
  duration: number;
  endTime: Date;
}

export type BeforeContext<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC> = BasicContext<
  B,
  A
>;

export type CoreContext<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC> = BasicContext<B, A> &
  BeforeC;

export type AfterContext<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC> = BasicContext<
  B,
  A
> &
BeforeC &
AfterC;

export type ErrorContext<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC> = BasicContext<
  B,
  A
> &
BeforeC &
AfterC &
ErrorC;

export type FinalContext<B extends Record<any, any> = Record<any, any>, A extends AfterC = AfterC> = BasicContext<
  B,
  A
> &
BeforeC &
Partial<AfterC & ErrorC> &
FinalC;
