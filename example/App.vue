<script setup lang="ts">
import {  request, get } from "@/api";
const t = get("/test");
const handleClick = () => {
  t().then(data => {
    // console.log(data);
  });
}
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="handleClick">abc</button>

</template>