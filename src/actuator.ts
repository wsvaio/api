import { middleware } from "./env"
// 执行器

export const actuator = async <T>(ctx: T, ...middleware: middleware<T>[]) => {
  let index = -1;
  await (async function next() {
    if (++index >= middleware.length) return;
    const auto = middleware[index].length <= 1;
    await middleware[index](ctx, next);
    auto && await next();
  })();
  return ctx;
}