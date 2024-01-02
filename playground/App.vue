<script setup lang="ts">
import { createContext, currying, exec, nativeFetchRequester } from "@wsvaio/api";

// import { api } from "./api";
// \
const ctx = createContext({
  requester: nativeFetchRequester,
  // a: 1,
  // ''
  a: 1,
  log: true,
});

createContext(ctx);
async function handleClick() {
  // get<{ q: { a: number }; d: string }>({ b: { a: 1, b: 2 } })({ q: { a: 1 } }).then(data => {
  // 	console.log(data);
  // });

  console.log("sdf");
  // api.request({
  //   path: "/test",

  //   log: true,
  // }).then(data => {
  //   // data.data
  // });

  const res = await exec(ctx).then(data => data);
  // res.
  console.log("sdf");

  const a = currying(ctx)("123")({ config: true })({});
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">
    123
  </button>
</template>
