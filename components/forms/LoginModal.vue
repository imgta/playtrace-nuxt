<script setup lang="ts">
const { login } = useStrapiAuth();
const { toast } = useMisc();

const popLogin = ref<any | null>(null);
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;
const corpoLogin = ref('');
const userData = reactive({
    username: '',
    password: '',
});

// ----------------------------------------------------------------

async function onLogin() {
    try {
        await login({ identifier: userData.username, password: userData.password });
        navigateTo('/events');
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

function closeLogin() {
    userData.username = '';
    userData.password = '';
}

const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-neutral/95': pageTheme === 'fantasy' || 'corporate',
    };
});

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        corpoLogin.value = 'logincorp';
    } else {
        corpoLogin.value = 'login';
    }
});

// ----------------------------------------------------------------
</script>

<template>
<button class="btn-primary font-normal btn-outline btn-sm normal-case mt-0" @click="openLogin">
    <span class="hover:text-neutral-content w-full h-full flex items-center">
        Login
    </span>
</button>
<dialog ref="popLogin" class="modal">

    <form :class="formBg" method="dialog" class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Sign in.
        </h1>
        <p class="text-neutral-content/80 text-center text-sm">
            We've missed you!
        </p>
        <div class="card-body pt-5 pb-1.5 bg-none">

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
                    <NuxtLink to="/" class="link link-hover hover:link-primary">
                        <span class="label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight">
                            Forgot password?
                        </span>
                    </NuxtLink>
                </label>
            </div>

            <div class="flex justify-center items-center w-full h-14 pr-3.5">
                <button type="submit" :class="corpoLogin" @click="onLogin">
                    <span>Log in</span>
                    <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </div>

            <label class="label m-0 pt-2 pb-0 justify-center">
                <NuxtLink to="/" class="link link-hover hover:link-primary">
                    <span class="label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight pl-2">
                        C'mon, sign up already!
                    </span>
                </NuxtLink>
            </label>

        </div>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button @click="closeLogin">close</button>
    </form>
</dialog>
</template>
