import { is, pick, trying } from "@wsvaio/utils";
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
      } & RequestInit
    >
  ) => {
    if (ctx.timeout) {
      const controller = new AbortController();
      ctx.signal = controller.signal;
      setTimeout(() => controller.abort(), ctx.timeout);
    }

    let body: any;
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

// 待实现
export function nuxtFetchRequester() {}
// 待实现
export function uniappRequester() {}
