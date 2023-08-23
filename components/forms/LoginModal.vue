<script setup lang="ts">
import '@/assets/css/button.css';

definePageMeta({
    middleware: 'auth'
});
const { login } = useStrapiAuth();
const { toast } = useMisc();

// ----------------------------------------------------------------
const userData = reactive({
    username: '',
    password: '',
});
const popLogin = ref<any | null>(null);
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie.value);
// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await login({ identifier: userData.username, password: userData.password });
        navigateTo('/dashboard');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

function openLogin() {
    if (popLogin.value) {
        popLogin.value.showModal();
    }
}

const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-neutral/95': pageTheme === 'fantasy' || 'corporate',
    };
});

// const formButton = computed(() => {
//     return {
//         'rounded-3xl': pageTheme === 'dracula' || 'night',
//         'rounded-full': pageTheme === 'fantasy',
//         'rounded-none': pageTheme === 'corporate',
//     };
// });
</script>

<template>
<button class="btn-primary font-normal btn-outline btn-sm normal-case mt-0" @click="openLogin">Login</button>
<dialog ref="popLogin" class="modal">

    <form :class="formBg" method="dialog" class="modal-box w-auto max-fit px-9 pb-6">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Sign in.
        </h1>
        <p class="text-neutral-content/80 text-center text-sm pb-5">
            Welcome back!
        </p>
        <div class="hero bg-none">
            <div class="card-body pt-5 pb-3 bg-none">
                <div class="focus:text-base-content bg-none">
                    <label class="label-text text-neutral-content/80">Username</label>
                    <input
                        v-model="userData.username"
                        type="text"
                        name="username"
                        class="form-control input input-bordered focus:bg-base-100 w-full"
                    />
                    <label class="label-text text-neutral-content/80">Password</label>
                    <input
                        v-model="userData.password"
                        type="password"
                        name="password"
                        class="form-control input input-bordered focus:bg-base-100 w-full"
                    />
                    <label class="label m-0 pt-0">
                        <NuxtLink to="/" class="link link-hover">
                            <span class="label-text-alt text-neutral-content/80">Forgot password?</span>
                        </NuxtLink>
                    </label>
                </div>
                <div class="flex justify-center items-center w-full h-14">

                    <button type="submit" class="bubble" @click="onSubmit">
                        <span>Log in</span>
                        <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>

                </div>
            </div>
        </div>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button>close</button>
    </form>
</dialog>
</template>
