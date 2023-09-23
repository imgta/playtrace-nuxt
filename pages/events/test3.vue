<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});
const { brevoMailAPI } = useRuntimeConfig().public;
const { inviteEmail } = useBrevo(brevoMailAPI);
const toEmail = 'gphamta@gmail.com';
const fullName = 'Gordon T';

// ----------------------------------------------------------------
onMounted(() => {
    // console.log('brevoMailAPI', brevoMailAPI);
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------
</script>

<template>
<div>
    <!-- <button @click="inviteEmail">
        Email Notify
    </button> -->
</div>
</template>
