<script setup lang="ts">
defineProps<{ myLoading: boolean }>();
</script>

<template>
    <div>
        <div v-if="myLoading" class="w-full h-full bg-neutral opacity-60 z-40 fixed top-0 left-0" />
        <progress
            v-if="myLoading"
            class="bg-neutral/60 z-50 fixed top-1/2 inset-x-2/4 progress progress-primary w-56 -ml-28"
        />
    </div>
</template>
