import type { Middleware } from "@wsvaio/utils";

export type { Middleware };

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

  // response解析方式
  dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";

  befores: Middleware<BasicContext<B, A>>[];
  requester: typeof Requester<B, A>;
  afters: Middleware<AfterContext<B, A>>[];
  errors: Middleware<ErrorContext<B, A>>[];
  finals: Middleware<FinalContext<B, A>>[];

  [k: string]: any;
} & B;

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
