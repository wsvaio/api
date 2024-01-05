<script setup lang="ts">
import { getTest1, getTest2 } from "./api";

async function handleClick() {
  getTest1();
  getTest2();
  console.log("wdf");
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">
    123
  </button>
</template>
