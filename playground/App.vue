<script setup lang="ts">
import { get } from "./api";

const handleClick = () => {
	get<{ q: { a: number }; d: string }>({ b: { a: 1, b: 2 } })({ q: { a: 1 } }).then(data => {
		console.log(data);
	});
};
</script>

<template>
	<h1>Hello World !</h1>
	<button @click="handleClick">123</button>
</template>
