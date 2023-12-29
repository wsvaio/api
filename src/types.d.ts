import type { Middleware } from "@wsvaio/utils";

export type { Middleware };

type IgnoreKeys =
  | "method"
  | "headers"
  | "url"
  | "baseURL"
  | "body"
  | "query"
  | "param"
  | "log"
  | "befores"
  | "afters"
  | "errors"
  | "finals";

export function Requester<B extends Record<any, any>, A extends AfterC | Promise<AfterC>>(ctx: CoreContext<B>): A;

export type BasicContext<T extends Record<any, any> = Record<any, any>> = {
  method: "get" | "post" | "put" | "patch" | "delete" | "options" | "head" | "connect" | "trace";
  headers: Record<any, any>;
  url: string;
  baseURL: string;

  body: Record<any, any> | BodyInit | null;
  query: Record<any, any>;
  param: Record<any, any>;

  log: boolean;

  startTime: Date;

  // response解析方式
  dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";

  befores: Middleware<BasicContext<T>>[];
  requester: typeof Requester;
  afters: Middleware<AfterContext<T>>[];
  errors: Middleware<ErrorContext<T>>[];
  finals: Middleware<FinalContext<T>>[];
} & Omit<T, IgnoreKeys>;

export interface BeforeC {
  fullPath: string;
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

export type BeforeContext<T extends Record<any, any> = Record<any, any>> = BasicContext<T>;

export type CoreContext<T extends Record<any, any> = Record<any, any>> = BasicContext<T> & BeforeC;

export type AfterContext<T extends Record<any, any> = Record<any, any>> = BasicContext<T> & BeforeC & AfterC;

export type ErrorContext<T extends Record<any, any> = Record<any, any>> = BasicContext<T> & BeforeC & AfterC & ErrorC;

export type FinalContext<T extends Record<any, any> = Record<any, any>> = BasicContext<T> &
  BeforeC &
  Partial<AfterC & ErrorC> &
  FinalC;
