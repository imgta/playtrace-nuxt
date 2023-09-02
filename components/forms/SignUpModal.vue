<script setup lang="ts">
const { register } = useStrapiAuth();
const { toast } = useMisc();

const popSignUp = ref<any | null>(null);
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie.value) as any;
const signupTheme = ref('');

const signupData = reactive({
    fullname: '',
    email: '',
    username: '',
    password: '',
});

// ----------------------------------------------------------------
async function onRegister() {
    try {
        await register({ username: signupData.username, email: signupData.email, fullName: signupData.fullname, password: signupData.password, });
        navigateTo('/');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

function openSignup() {
    if (popSignUp.value) {
        popSignUp.value.showModal();
    }
}

// ----------------------------------------------------------------
const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-neutral/95': pageTheme === 'fantasy' || 'corporate',
    };
});

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        signupTheme.value = 'signupcorp';
    } else {
        signupTheme.value = 'signup';
    }
});
</script>

<template>
<button class="btn-primary btn-outline btn-sm" @click="openSignup">
    <div class="hover:text-neutral-content min-w-full h-full flex items-center">
        Signup
    </div>
</button>

<dialog ref="popSignUp" class="modal">
    <form :class="formBg" method="dialog" class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Register.
        </h1>
        <p class="text-neutral-content/80 text-center text-sm">
            Join the party!
        </p>

        <div class="card-body pt-5 pb-1.5 bg-none">
            <div class="focus:text-base-content bg-none">
                <label class="label-text text-neutral-content/80">Full Name</label>
                <input
                    v-model="signupData.fullname"
                    required
                    type="text"
                    name="fullname"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Email</label>
                <input
                    v-model="signupData.email"
                    required
                    type="email"
                    name="email"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Username</label>
                <input
                    v-model="signupData.username"
                    required
                    type="text"
                    name="username"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Password</label>
                <input
                    v-model="signupData.password"
                    required
                    type="password"
                    name="password"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
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

            <label class="label m-0 pt-2 pb-0 justify-center">
                <NuxtLink to="/" class="link link-hover hover:link-primary">
                    <span class="label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight pl-1.5">
                        Have we met before?
                    </span>
                </NuxtLink>
            </label>
        </div>

    </form>

    <form method="dialog" class="modal-backdrop"><button>close</button></form>
</dialog>
</template>
