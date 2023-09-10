<script setup lang="ts">
const route = useRoute();

console.log('route.params', route.params);
</script>

<template>
    <div>event id: {{ $route.params.id }}</div>
</template>
