<script setup lang="ts">
import { post } from "./api";

const handleClick = () => {
	post({ b: { a: 1, b: 2 } });
};
</script>

<template>
	<h1>Hello World !</h1>
	<button @click="handleClick">
		123
	</button>
</template>
