import { merge, omit } from "@wsvaio/utils";

export function mergeContext(context: any, ...contexts: any[]) {
  const keys = ["befores", "afters", "errors", "finals"] as const;
  keys.forEach(key => {
    !Array.isArray(context[key]) && (context[key] = []);
    contexts
      .filter(item => !!item)
      .forEach(item => {
        Array.isArray(item[key]) && context[key].push(...item[key]);
        merge(context, omit(item, [...keys]), {
          deep: Number.POSITIVE_INFINITY,
        });
      });
  });
  return context;
}

export function getFullPath<
  T extends {
    query?: Record<any, any>;
    param?: Record<any, any>;
    path: string;
    body?: Record<any, any> | BodyInit | null;
  },
>({ query = {}, param = {}, path, body = {} }: T) {
  let fullPath = path;

  fullPath.match(/:[\w_][\w\d_]*\??/gims)?.forEach(matched => {
    const key = matched.slice(1, matched.length - (matched.endsWith("?") ? 1 : 0));
    const val = param[key] || body?.[key] || query[key] || "";
    if (!val && !matched.endsWith("?"))
      return;
    fullPath = fullPath.replace(matched, val);
  });
  fullPath = fullPath.replace(/\/+/gims, "/");

  fullPath += fullPath.includes("?") ? "&" : "?";
  Object.entries<any>(query).forEach(([k, v]) =>
    Array.isArray(v)
      ? v.forEach(item => (fullPath += `${k}=${item}&`))
      : ![null, undefined, ""].includes(v) && (fullPath += `${k}=${v}&`)
  );
  fullPath = fullPath.substring(0, fullPath.length - 1);

  return fullPath;
}

// export function getRawBody<T extends { method: string; body?: Record<any, any> | BodyInit | null }>({
//   method = "get",
//   body,
// }: T) {
//   // let body: any;
//   // if (!["get", "head"].includes(ctx.method.toLowerCase()) && is("Object", "Array")(ctx.body)) {
//   //   await trying(() => {
//   //     body = JSON.stringify(ctx.body);
//   //     ctx.headers!["Content-Type"] = "application/json;charset=UTF-8";
//   //   }).catch(() => {});
//   // }
// }
