<script setup lang="ts">
// const { toast, loading } = useMisc();
definePageMeta({
    middleware: 'auth'
});

// toast.info('Success', { timeout: 1400 });
</script>

<template>
    <DashSide />
        <slot />
    <DashHeader />
</template>
