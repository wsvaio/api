<script setup lang="ts">
import { request, get, post } from "@/api";
const t = post("/test");
const handleClick = () => {
  t({ body: { a: 1 } }).then(data => {
    // console.log(data);
  });
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">abc</button>

</template>