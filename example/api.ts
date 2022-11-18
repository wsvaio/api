import { createAPI } from "@wsvaio/api";
export const { get, post, request, befores, afters, errors, finals } = createAPI({
  log: true,
  // timeout: 1,
  // baseURL: "",

  // headers: {
  //   "Context-Type": "Application/json"
  // }
});


befores.push(
  async ctx => {
    // console.log("before")
  },

);

afters.push(
  async ctx => {
    // console.log("after")
  }
)


errors.push(
  async ctx => {
    // console.log("error")
  }
)

finals.push(
  async ctx => {
    // console.log("final")
  }
)

export const getTest = get("/api/get/test");
export const postTest = get("/api/post/test");