<script setup lang="ts">
import '@/assets/css/button.css';
import NewEvent from '@/components/events/NewEvent.vue';

const { toast } = useMisc();

// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await register({ username: userData.username, email: userData.email, fullName: userData.fullname, password: userData.password, });
        navigateTo('/');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

function openSignup() {
    if (popForm.value) {
        popForm.value.showModal();
    }
}

// ----------------------------------------------------------------
</script>

<template>
<div>
    <NewEvent />
</div>
</template>
