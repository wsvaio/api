export const _errors: ctx["_errors"] = [
  async (ctx, next) => {
    // AbortError AbortController触发 请求超时
    ctx.message = ctx.error.message;
    ctx?.error?.name == "AbortError" ? (ctx.message = `请求超时：${ctx.timeout}`) : ctx.message = ctx?.error?.message;
    await next();
    // 总会抛出错误
    return Promise.reject(ctx);
  }
]