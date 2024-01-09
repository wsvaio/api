import { is, pick, trying } from "@wsvaio/utils";

import type { NitroFetchOptions } from "nitropack";
import type { FetchContext, FetchResponse } from "ofetch";
import type { AfterPatch, BeforePatch, CoreContext, Requester } from "./types";

export function defineRequester<B extends BeforePatch = BeforePatch, A extends AfterPatch = AfterPatch>(
  requester: typeof Requester<B, A>
) {
  return requester;
}

export const nativeFetchRequester = defineRequester(
  async (
    ctx: CoreContext<
      {
        timeout?: number;
        dataType?: "arrayBuffer" | "blob" | "formData" | "json" | "text";
      } & Omit<RequestInit, "body" | "headers" | "method">
    >
  ) => {
    if (ctx.timeout) {
      const controller = new AbortController();
      ctx.signal = controller.signal;
      setTimeout(() => controller.abort(), ctx.timeout);
    }

    let body: any = ["get", "head"].includes(ctx.method.toLowerCase()) ? null : ctx.body;
    if (!["get", "head"].includes(ctx.method.toLowerCase()) && is("Object", "Array")(ctx.body)) {
      await trying(() => {
        body = JSON.stringify(ctx.body);
        ctx.headers!["Content-Type"] = "application/json;charset=UTF-8";
      }).catch(() => {});
    }

    const response = await fetch(ctx.url, {
      body,
      ...pick(ctx, [
        "cache",
        "credentials",
        "headers",
        "integrity",
        "keepalive",
        "method",
        "mode",
        "redirect",
        "referrer",
        "referrerPolicy",
        "signal",
        "window",
      ]),
    });

    let data: any;
    if (ctx.dataType) {
      data = await response[ctx.dataType]();
    }
    else {
      const text = await response.text();
      data = await trying(() => JSON.parse(text)).catch(() => text);
      ctx.dataType = is("String")(data) ? "text" : "json";
    }

    return {
      ok: response.ok,
      message: response.statusText,
      data,
      status: response.status,
      statusText: response.statusText,
      response,
    };
  }
);

// nuxt $fetch
export const nuxtFetchRequester = defineRequester(
  async (
    ctx: CoreContext<
      Omit<
        NitroFetchOptions<
          string,
          "get" | "head" | "patch" | "post" | "put" | "delete" | "connect" | "options" | "trace"
        >,
        "baseURL" | "body" | "query" | "params" | "method"
      >
    >
  ) => {
    const context = await new Promise<FetchContext & { response: FetchResponse<ResponseType> }>(resolve => {
      $fetch(ctx.url, {
        ...pick(ctx, [
          "body",
          "cache",
          "credentials",
          "duplex",
          "headers",
          "ignoreResponseError",
          "integrity",
          "keepalive",
          "method",
          "mode",
          "parseResponse",
          "redirect",
          "referrer",
          "referrerPolicy",
          "responseType",
          "retry",
          "retryDelay",
          "retryStatusCodes",
          "signal",
          "timeout",
          "window",
          "onRequest",
          "onRequestError",
          // "onResponse",
          "onReponseError",
        ]),
        onResponse(context) {
          ctx.onResponse && ctx.onResponse(context);
          resolve(context);
        },
      });
    });
    if (context.error)
      throw context.error;
    return {
      response: context.response,
      ok: context.response.ok,
      message: context.response.statusText,
      status: context.response.status,
      data: context.response._data,
    };
  }
);
// Uniapp uni.request
export const uniappRequester = defineRequester(
  async (
    ctx: CoreContext<
      { body: string | ArrayBuffer | AnyObject | undefined; task?: UniApp.RequestTask } & Omit<
        UniApp.RequestOptions,
        "data" | "method" | "url"
      >
    >
  ) => {
    const response: UniApp.RequestSuccessCallbackResult = await new Promise((resolve, reject) => {
      ctx.task = uni.request({
        ...pick(ctx, [
          "header",
          "timeout",
          "dataType",
          "responseType",
          "sslVerify",
          "withCredentials",
          "firstIpv4",
          "enableHttp2",
          "enableQuic",
          "enableCache",
          "enableHttpDNS",
          "httpDNSServiceId",
          "enableChunked",
          "forceCellularNetwork",
          "enableCookie",
          "cloudCache",
          "defer",
        ]),
        method: ctx.method.toUpperCase() as UniApp.RequestOptions["method"],
        url: ctx.url,
        data: ctx.body,
        success(result) {
          ctx.success && ctx.success(result);
          resolve(result);
        },
        fail(result) {
          ctx.fail && ctx.fail(result);
          reject(result);
        },
        complete: ctx.complete,
      });
    });

    return {
      data: response.data,
      status: response.statusCode,
      message: response.errMsg || "OK",
      response,
      task: ctx.task!,
    };
  }
);
