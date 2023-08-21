<script setup lang="ts">
const { login } = useStrapiAuth();

const userData = reactive({
    username: '',
    password: '',
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await login({ identifier: userData.username, password: userData.password });
        navigateTo('/');
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
    <div>
        <h1>LOGIN</h1>
        <input id="username" v-model="userData.username" type="text" name="username" placeholder="username" />
        <br />
        <input id="password" v-model="userData.password" type="password" name="password" placeholder="password" />
        <br />
        <button @click="onSubmit">
            Register
        </button>
    </div>
</template>
