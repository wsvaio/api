<script setup lang="ts">
import {  request, get } from "@/api";
</script>

<template>
  <h1>Hello World !</h1>
  <button @click="get()()">abc</button>

</template>