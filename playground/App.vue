<script setup lang="ts">
import { api } from "./api";

function handleClick() {
  // get<{ q: { a: number }; d: string }>({ b: { a: 1, b: 2 } })({ q: { a: 1 } }).then(data => {
  // 	console.log(data);
  // });

  console.log("sdf");
  api.request({
    path: "/test",
    log: true,
  });
  console.log("sdf");
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">
    123
  </button>
</template>
