import type { Middleware } from "@wsvaio/utils";

export type { Middleware };

// 保留字段
// export type ReservedField =
//   | "method"
//   | "headers"
//   | "origin"
//   | "path"
//   | "log"
//   | "startTime"
//   | "befores"
//   | "requester"
//   | "afters"
//   | "errors"
//   | "finals"
//   | "fullPath"
//   | "url"
//   | "duration"
//   | "status"
//   | "data"
//   | "message"
//   | "error"
//   | "endTime"
//   | "body"
//   | "query"
//   | "param";

export function Requester<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch>(
  ctx: CoreContext<B>
): Promise<A>;

export type BasicContext<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch> = {
  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
  headers: Record<any, any>;

  origin: string;
  path: string;

  body: Record<any, any> | BodyInit | null;
  query: Record<any, any>;
  param: Record<any, any>;

  log: boolean;

  startTime: Date;

  befores: Middleware<BasicContext<B, A>>[];
  requester: typeof Requester<B, A>;
  afters: Middleware<AfterContext<B, A>>[];
  errors: Middleware<ErrorContext<B, A>>[];
  finals: Middleware<FinalContext<B, A>>[];
} & B &
Record<any, any>;

export interface BeforePatch {}
export interface CorePatch {
  fullPath: string;
  url: string;
}
export interface AfterPatch {
  status: number;
  message: string;
  data: any;
}
export interface ErrorPatch {
  error: Error;
}

export interface FinalPatch {
  duration: number;
  endTime: Date;
}

export type BeforeContext<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch> = BasicContext<B, A>;

export type CoreContext<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch> = BasicContext<B, A> &
  CorePatch;

export type AfterContext<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch> = BasicContext<B, A> &
  CorePatch &
  A;

export type ErrorContext<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch> = BasicContext<B, A> &
  CorePatch &
  Partial<A> &
  ErrorPatch;

export type FinalContext<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch> = BasicContext<B, A> &
  CorePatch &
  Partial<A & ErrorPatch> &
  FinalPatch;

export type InferRequesterB<T> = T extends typeof Requester<infer B extends Record<any, any>> ? B : never;

export type isPartial<T> = Partial<T> extends T ? true : false;
