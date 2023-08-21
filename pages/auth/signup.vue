<script setup lang="ts">
const { register } = useStrapiAuth();

const userData = reactive({
    username: '',
    email: '',
    fullname: '',
    password: '',
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await register({ username: userData.username, email: userData.email, fullName: userData.fullname, password: userData.password, });
        navigateTo('/');
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
    <div>
        <h1>REGISTER</h1>
        <input id="username" v-model="userData.username" type="text" name="username" placeholder="username" />
        <br />
        <input id="email" v-model="userData.email" type="email" name="email" placeholder="email" />
        <br />
        <input id="fullname" v-model="userData.fullname" type="text" name="fullname" placeholder="full name" />
        <br />
        <input id="password" v-model="userData.password" type="password" name="password" placeholder="password" />
        <br />
        <button @click="onSubmit">
            Register
        </button>
    </div>
</template>
