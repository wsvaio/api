<script setup lang="ts">
import { post } from "@/api";
const t = post("/test");
const handleClick = () => {
  t({ b: { a: 1 }, q: {f: 231}, p: {a: 123} }).then(data => {
    console.log(data);
  }).catch(err => {
    console.log(err);
  });
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">abc</button>

</template>