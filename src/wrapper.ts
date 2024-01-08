import type { DeepPartial, IsEqual } from "@wsvaio/utils";
import { omit } from "@wsvaio/utils";
import { mergeContext } from "./utils";
import type { AfterPatch, BeforeContext, BeforePatch, FinalContext } from "./types";
import { exec } from "./executer";

export interface Currying<
  E extends {} = {},
  C extends {} = {},
  R extends "context" | "data" = "data",
  B extends BeforePatch = BeforePatch,
  A extends AfterPatch = AfterPatch,
> {
  <T extends {}>(config: string): Currying<T & E, T & C, R, B, A>;
  <T extends {}>(
    config: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config: true; returnType: "context" }
  ): Currying<T & E, T & DeepPartial<E>, "context", B, A>;
  <T extends {}>(
    config: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config: true; returnType?: "data" }
  ): Currying<T & E, T & DeepPartial<E>, "data", B, A>;
  (
    config: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config?: false; returnType: "context" }
  ): Promise<FinalContext<B & E, A>>;
  <T>(
    config: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config?: false; returnType: "data" }
    // @ts-expect-error pass
  ): Promise<IsEqual<T, unknown> extends true ? (IsEqual<E["data"], unknown> extends true ? A["data"] : E["data"]) : T>;
  <T>(config?: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config?: false }): R extends "context"
    ? Promise<FinalContext<B & E, A>>
    : Promise<
        // @ts-expect-error pass
        IsEqual<T, unknown> extends true ? (IsEqual<E["data"], unknown> extends true ? A["data"] : E["data"]) : T
      >;
}

/**
 * 柯里化包装器
 * @type E extends 继承的类型
 * @type C config extends 继承的配置类型
 * @type R returnType 返回值的类型
 * @type B before context请求前的自定义类型
 * @type A after context请求后的自定义类型
 */
export function currying<
  E extends {} = {},
  C extends {} = {},
  R extends "context" | "data" = "data",
  B extends BeforePatch = BeforePatch,
  A extends AfterPatch = AfterPatch,
>(context: BeforeContext<B, A>, ...contexts: Record<any, any>[]): Currying<E, C, R, B, A> {
  // function result<T extends {}>(
  //   config: (Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config: true; returnType: "context" }) | string
  // ): ReturnType<typeof currying<T & E, T & DeepPartial<E>, "context", B, A>>;
  // function result<T extends {}>(
  //   config: (Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config: true; returnType?: "data" }) | string
  // ): ReturnType<typeof currying<T & E, T & DeepPartial<E>, "data", B, A>>;
  // function result(
  //   config?: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config?: false; returnType: "context" }
  // ): Promise<FinalContext<B & E, A>>;
  // function result<T>(
  //   config?: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config?: false; returnType: "data" }
  //   // @ts-expect-error pass
  // ): Promise<IsEqual<T, unknown> extends true ? (IsEqual<E["data"], unknown> extends true ? any : E["data"]) : T>;
  // function result<T>(
  //   config?: Omit<C, "data"> & Partial<BeforeContext<B, A>> & { config?: false; returnType?: "data" | "context" }
  // ): R extends "context"
  //   ? Promise<FinalContext<B & R, A>>
  //   : // @ts-expect-error pass
  //   Promise<IsEqual<T, unknown> extends true ? (IsEqual<E["data"], unknown> extends true ? any : E["data"]) : T>;
  // function result(
  //   config: (Partial<BeforeContext<B, A>> & { config?: boolean; returnType?: "data" | "context" }) | string = {}
  // ) {
  //   if (typeof config === "string")
  //     return currying(context, ...contexts, { path: config, config: true, returnType: "data" });
  //   if (config.config === true)
  //     return currying(context, ...contexts, omit(config, ["config", "returnType"]));

  //   return exec(mergeContext({}, context, ...contexts, omit(config, ["config", "returnType"]))).then(data =>
  //     config?.returnType !== "context" ? data.data : data
  //   );
  // }

  // @ts-expect-error pass
  return (config: Record<any, any> = {}) => {
    if (typeof config === "string")
      return currying(context, ...contexts, { path: config });
    if (config.config === true)
      return currying(context, ...contexts, omit(config, ["config"]));
    return exec(mergeContext({}, context, ...contexts, omit(config, ["config"]))).then(data =>
      data?.returnType !== "context" ? data.data : data
    );
  };
}
