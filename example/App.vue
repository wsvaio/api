<script setup lang="ts">
import { post } from "@/api";
const t = post("/test");
const handleClick = () => {
  t({ b: { a: 1 }, q: {f: 231, sda: '附件是独立房间啊但是氨基酸地方喀什地方'}, p: {a: 123} }).then(data => {
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