<script setup lang="ts">
const { login, register } = useStrapiAuth();
const { toast } = useMisc();

const popLogin = ref<any | null>(null);
const popSignUp = ref<any | null>(null);
const popSwitch = ref('');

const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;
const loginTheme = ref('');
const signupTheme = ref('');

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
const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-neutral/95': pageTheme === 'fantasy' || 'corporate',
    };
});
watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        loginTheme.value = 'logincorp';
        signupTheme.value = 'signupcorp';
    } else {
        loginTheme.value = 'login';
        signupTheme.value = 'signup';
    }
    console.log('popSwitch.value', popSwitch.value);
});

// ----------------------------------------------------------------
// TODO: modal switching leaves dialog overlay residuals
async function onLogin() {
    try {
        await login({ identifier: loginData.username, password: loginData.password });
        navigateTo('/events');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

async function onRegister() {
    try {
        await register({ username: signupData.username, email: signupData.email, fullName: signupData.fullname, password: signupData.password, });
        navigateTo('/events');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

function closeLogin() {
    loginData.username = '';
    loginData.password = '';
}
function openLogin() {
    if (popLogin.value) {
        popLogin.value.showModal();
    }
    popSwitch.value = 'login';
}
function openSignup() {
    if (popSignUp.value) {
        popSignUp.value.showModal();
    }
    popSwitch.value = 'signup';
}

async function formSwitch() {
    if (popSwitch.value === 'signup') {
        openLogin();
    } else if (popSwitch.value !== 'signup') {
        closeLogin();
        openSignup();
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <button class="btn-primary font-normal btn-outline btn-sm normal-case mt-0" @click="openLogin">
        <span class="hover:text-neutral-content w-full h-full flex items-center">
            Login
        </span>
    </button>

    <dialog ref="popLogin" class="modal">

        <div v-if="popSwitch === 'login'" :class="formBg" method="dialog"
            class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
            <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
                Sign in.
            </h1>
            <p class="text-neutral-content/80 text-center text-sm">
                We've missed you!
            </p>
            <div class="card-body pt-5 pb-1.5 bg-none">

                <div class="focus:text-base-content bg-none">

                    <label class="label-text text-neutral-content/80">Username</label>
                    <input v-model="loginData.username" type="text" name="username"
                        class="form-control input input-bordered focus:bg-base-100 w-full" @keyup.enter="onLogin" />

                    <label class="label-text text-neutral-content/80">Password</label>
                    <input v-model="loginData.password" type="password" name="password"
                        class="form-control input input-bordered focus:bg-base-100 w-full" @keyup.enter="onLogin" />

                    <label class="label m-0 pt-0">
                        <NuxtLink to="/" class="link link-hover hover:link-primary">
                            <span class="label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight">
                                Forgot password?
                            </span>
                        </NuxtLink>
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
                    class="modal-action justify-center label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight link link-hover mx-0 px-0"
                    @click="formSwitch">
                    C'mon, sign up already!
                </button>

            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeLogin">close</button>
        </form>
    </dialog>

    <button class="btn-primary btn-outline btn-sm" @click="openSignup">
        <div class="hover:text-neutral-content min-w-full h-full flex items-center">
            Signup
        </div>
    </button>

    <dialog ref="popSignUp" class="modal">
        <div v-if="popSwitch === 'signup'" :class="formBg" method="dialog"
            class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
            <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
                Register.
            </h1>
            <p class="text-neutral-content/80 text-center text-sm">
                Join the party!
            </p>

            <div class="card-body pt-5 pb-1.5 bg-none">
                <div class="focus:text-base-content bg-none">
                    <label class="label-text text-neutral-content/80">Full Name</label>
                    <input v-model="signupData.fullname" required type="text" name="fullname"
                        class="form-control input input-bordered focus:bg-base-100 w-full" />

                    <label class="label-text text-neutral-content/80">Email</label>
                    <input v-model="signupData.email" required type="email" name="email"
                        class="form-control input input-bordered focus:bg-base-100 w-full" />

                    <label class="label-text text-neutral-content/80">Username</label>
                    <input v-model="signupData.username" required type="text" name="username"
                        class="form-control input input-bordered focus:bg-base-100 w-full" />

                    <label class="label-text text-neutral-content/80">Password</label>
                    <input v-model="signupData.password" required type="password" name="password"
                        class="form-control input input-bordered focus:bg-base-100 w-full" @keyup.enter="onRegister" />

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
                    class="modal-action justify-center label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight link link-hover mx-0 px-0"
                    @click="formSwitch">
                    Have we met before?
                </button>

            </div>

        </div>

        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
