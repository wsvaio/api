<script setup lang="ts">

import { createAPI } from "createAPI";
import { onMounted, ref } from "vue";

const ctx = createAPI({
  log: true,
  baseURL: "/api"
});

const a = ref();
onMounted(async () => {
  a.value = await ctx.request({})();
  
});

</script>

<template>
  <h1>Hello World !</h1>
  <h2>{{ a }}</h2>
</template>