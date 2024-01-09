<script setup lang="ts">
import {} from "vue";
import { getTest1, getTest2 } from "./api";

async function handleClick() {
  getTest1();
  const r = getTest2();
  console.log("wdf", r, { ...r.ctx });

  setTimeout(() => {
    console.log("wdf", r, { ...r.ctx });
  });
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">
    123
  </button>
</template>
