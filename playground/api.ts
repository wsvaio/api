import { create, createByNativeFetch, nuxtFetchRequester, uniappRequester, } from "@wsvaio/api";

export const { get, use } = createByNativeFetch({
  base: "http://localhost:5173/",
  log: true,
  cus: 123,
});

export const getTest1 = get({ path: "/test1", config: true, method: "post" });
export const getTest2 = get<{ query: { q1: number } }>("/test1/:id?")({
  config: true,
  query: { q1: 1, q2: "q2" },
  param: { id: 123 },
  returnType: "context"
});

use("before")(async ctx => {
  console.log(ctx, "before");
});

export const uniapp = create(uniappRequester)({

});

export const nuxt = create(nuxtFetchRequester)({

});

getTest1({ body: {} });
// uniapp.get("/fu")({ returnType: "data" }).then(data => {
//   // data

// });
