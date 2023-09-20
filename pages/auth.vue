<script setup lang="ts">

const { toast } = useMisc();
const { login, register } = useStrapiAuth();
const themeCookie = useCookie('selectedTheme');
const loginTheme = ref('');
const signupTheme = ref('');
const route = useRoute();

const authSwitch = ref<string>('login');

const loginData = reactive({
    username: '',
    password: '',
});
const signupData = reactive({
    fullname: '',
    email: '',
    username: '',
    password: '',
});
// ----------------------------------------------------------------
watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        loginTheme.value = 'logincorp';
        signupTheme.value = 'signupcorp';
    } else {
        loginTheme.value = 'login';
        signupTheme.value = 'signup';
    }
});
// ----------------------------------------------------------------
toast.error('Please login or register.', { timeout: 1500 });

async function onLogin() {
    if (!loginData.username) {
        toast.error('Username required!', { timeout: 1700 });
        return;
    } else if (!loginData.password) {
        toast.error('Password required!', { timeout: 1700 });
        return;
    }
    try {
        await login({ identifier: loginData.username, password: loginData.password });
    } catch (error: any) {
        toast.error((error.error.message as string), { timeout: 2000 });
        console.error(error);
    } finally {
        toast.success('User logged in!', { timeout: 2000 });
        navigateTo(<string>route.query.redirect);
    }
}

async function onDemo() {
    try {
        loginData.username = 'demo';
        loginData.password = 'demo123';
        await login({ identifier: loginData.username, password: loginData.password });
    } catch (error) {
        console.error(error);
    } finally {
        toast.success('Demo account active!', { timeout: 2000 });
        navigateTo(<string>route.query.redirect);
    }
}

async function onRegister() {
    if (!signupData.fullname) {
        toast.error('Full Name required!', { timeout: 1700 });
        return;
    } else if (!signupData.email) {
        toast.error('Email required!', { timeout: 1700 });
        return;
    } else if (!signupData.username) {
        toast.error('Username required!', { timeout: 1700 });
        return;
    } else if (!signupData.password) {
        toast.error('Password required!', { timeout: 1700 });
        return;
    }
    try {
        await register({ username: signupData.username, email: signupData.email, fullName: signupData.fullname, password: signupData.password, });
    } catch (error: any) {
        toast.error((error.error.message as string), { timeout: 2000 });
        console.error(error);
    } finally {
        toast.success('User registered!', { timeout: 2000 });
        navigateTo(<string>route.query.redirect);
    }
}
function clickLoginForm() {
    authSwitch.value = 'login';
}
function clickRegForm() {
    authSwitch.value = 'register';
}
// ----------------------------------------------------------------
</script>

<template>
    <div v-if="authSwitch === 'login'">
        <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
            Sign in.
        </h1>
        <p class="text-base-content/80 text-center text-sm">
            We've missed you!
        </p>
        <div class="card-body pt-5 pb-1.5">

            <div class="grid justify-center focus:text-base-content">
                <label class="label-text text-base-content/80">Username</label>
                <input v-model="loginData.username" type="text" name="username"
                    class="form-control input input-bordered form-input auth-input" @keyup.enter="onLogin" />

                <label class="label-text text-base-content/80">Password</label>
                <input v-model="loginData.password" type="password" name="password"
                    class="form-control input input-bordered form-input auth-input" @keyup.enter="onLogin" />
                <label class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt link link-primary font-semibold tracer brightness-[1.40]" @click="onDemo">
                        Demo?
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
                                xml:space="preserve">
                                <path d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
                            </svg>
                    </span>
                </label>
            </div>

            <div class="flex justify-center items-center w-full h-14 pr-3.5">
                <button type="submit" :class="loginTheme" @click="onLogin">
                    <span>Log in</span>
                    <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </div>

            <button
                class="modal-action justify-center label-text-alt text-base-content/90 hover:text-base-content font-light link link-hover"
                @click="clickRegForm">
                C'mon, sign up already!
            </button>
        </div>
    </div>

    <div v-if="authSwitch === 'register'">
        <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
            Register.
        </h1>
        <p class="text-base-content/80 text-center text-sm">
            Join the party!
        </p>

        <div class="card-body pt-5 pb-1.5 bg-none">

            <div class="grid justify-center focus:text-base-content bg-none">
                <label class="label-text text-base-content/80">Full Name</label>
                <input v-model="signupData.fullname" required type="text" name="fullname"
                    class="form-control input input-bordered form-input auth-input" />

                <label class="label-text text-base-content/80">Email</label>
                <input v-model="signupData.email" required type="email" name="email"
                    class="form-control input input-bordered form-input auth-input" />

                <label class="label-text text-base-content/80">Username</label>
                <input v-model="signupData.username" required type="text" name="username"
                    class="form-control input input-bordered form-input auth-input" />

                <label class="label-text text-base-content/80">Password</label>
                <input v-model="signupData.password" required type="password" name="password"
                    class="form-control input input-bordered form-input auth-input" @keyup.enter="onRegister" />
                    <label class="label">
                    <span class="label-text-alt"></span>
                    <span class="label-text-alt link link-primary font-semibold tracer brightness-[1.40]" @click="onDemo">
                        Demo?
                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
                                xml:space="preserve">
                                <path d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
                            </svg>
                    </span>
                </label>
            </div>

            <div class="flex justify-center items-center w-full h-14 pr-3.5">
                <button type="submit" :class="signupTheme" @click="onRegister">
                    <span>Register</span>
                    <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </div>

            <button
                class="modal-action justify-center label-text-alt text-base-content/90 hover:text-base-content font-light link link-hover"
                @click="clickLoginForm">
                Have we met before?
            </button>
        </div>
    </div>
</template>
