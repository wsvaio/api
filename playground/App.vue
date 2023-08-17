<script setup lang="ts">
import { get } from "./api";

const handleClick = () => {
	get({ b: { a: 1, b: 2 } });
};

get<{
	q: { a: number };
}>({
	q: { a: 123, b: 456 },
	befores: [

		async ctx => {

		}

	]
});
</script>

<template>
	<h1>Hello World !</h1>
	<button @click="handleClick">123</button>
</template>
