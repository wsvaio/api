<script setup lang="ts">
import { test1 } from "@/api";
const handleClick = () => {
  test1();
};
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">
    123
  </button>
</template>
