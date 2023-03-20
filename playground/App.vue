<script setup lang="ts">
import { test1 } from "@/api";
const ttt = test1({ q: { a: 1 }, config: true })({ p: { id: 123 }, config: true });
const handleClick = () => {
  ttt({ b: { abc: 123 }, config: true })();
  ttt({ b: { cba: 123 }, afters: [async (ctx) => {}], config: true })();
};
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">
    123
  </button>
</template>
