<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});
const { brevoMailAPI } = useRuntimeConfig().public;
const { inviteEmail } = useBrevo(brevoMailAPI);
const fromEmail = '200okteam@gmail.com';
const toEmail = 'gphamta@gmail.com';
const fullName = 'Gordon T';
const message = 'hello';

// ----------------------------------------------------------------
onMounted(() => {
    // console.log('brevoMailAPI', brevoMailAPI);
    // inviteEmail(fromEmail, toEmail, fullName, message);
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------
</script>

<template>
<div>

</div>
</template>
