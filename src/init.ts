import { _befores } from "./_befores"
import { _afters } from "./_afters"
import { _errors } from "./_errors"
import { _finals } from "./_finals"

export const init = {
  method: "get",
  headers: {},
  log: false,
  timeout: 0,
  url: "/",
  baseURL: "",
  body: null,
  query: {},
  param: {},

  befores: [],
  core: async ctx => ctx.response = await fetch(`${ctx.baseURL}${ctx.url}`, <RequestInit>ctx),
  afters: [],
  errors: [],
  finals: [],

  _befores,
  _afters,
  _errors,
  _finals,


  data: {},
  message: "Continue",
  status: 100
}
