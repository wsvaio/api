<script setup lang="ts">
import { get } from "./api";

const handleClick = () => {
	get({ b: { a: 1, b: 2 } })({

		befores: [
			async ctx => {
				console.log("斤斤计较", ctx);
			},
		],
	});
};
</script>

<template>
	<h1>Hello World !</h1>
	<button @click="handleClick">123</button>
</template>
