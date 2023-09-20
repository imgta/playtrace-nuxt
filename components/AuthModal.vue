<script setup lang="ts">
const emit = defineEmits(['inUser']);
const { toast } = useMisc();
const { login, register } = useStrapiAuth();
const popLogin = ref<any | null>(null);
const popSignUp = ref<any | null>(null);
const popSwitch = ref('');

const themeCookie = useCookie('selectedTheme');
const { value: pageTheme } = ref(themeCookie);
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
        loginTheme.value = 'logincorp auth-modal';
        signupTheme.value = 'signupcorp auth-modal';
    } else {
        loginTheme.value = 'login auth-modal';
        signupTheme.value = 'signup auth-modal';
    }
});

// ----------------------------------------------------------------
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
        navigateTo('/events');
    } catch (error: any) {
        toast.error((error.error.message as string), { timeout: 2000 });
        console.error(error);
    } finally {
        popLogin.value.close();
        toast.success('User logged in!', { timeout: 2000 });

        const { id } = useStrapiUser().value as any;
        emit('inUser', id);
    }
}

async function onDemo() {
    try {
        loginData.username = 'demo';
        loginData.password = 'demo123';
        await login({ identifier: loginData.username, password: loginData.password });
        navigateTo('/events');
    } catch (error) {
        console.error(error);
    } finally {
        popSignUp.value.close();
        popLogin.value.close();
        toast.success('Demo account active!', { timeout: 2000 });

        const { id } = useStrapiUser().value as any;
        emit('inUser', id);
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
        navigateTo('/events');
    } catch (error: any) {
        toast.error((error.error.message as string), { timeout: 2000 });
        console.error(error);
    } finally {
        popSignUp.value.close();
        toast.success('User registered!', { timeout: 2000 });

        const { id } = useStrapiUser().value as any;
        emit('inUser', id);
    }
}

function openLogin() {
    popLogin.value.showModal();
    popSwitch.value = 'login';
}
function closeLogin() {
    loginData.username = '';
    loginData.password = '';
    popLogin.value.close();
}

function openSignup() {
    popSignUp.value.showModal();
    popSwitch.value = 'signup';
}
function closeSignup() {
    popSignUp.value.close();
}

function formSwitch() {
    try {
        if (popSwitch.value === 'signup') {
            openLogin();
            closeSignup();
        } else if (popSwitch.value === 'login') {
            openSignup();
            closeLogin();
        }
    } catch (error) {
        console.error(error);
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
            <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
                Sign in.
            </h1>
            <p class="text-neutral-content/80 text-center text-sm">
                We've missed you!
            </p>
            <div class="card-body pt-5 pb-1.5 bg-none">

                <div class="focus:text-base-content bg-none">

                    <label class="label-text text-neutral-content/80">Username</label>
                    <input v-model="loginData.username" type="text" name="username"
                        class="form-control input input-bordered form-input auth-input" @keyup.enter="onLogin" />
                    <label class="label-text text-neutral-content/80">Password</label>
                    <input v-model="loginData.password" type="password" name="password"
                        class="form-control input input-bordered form-input auth-input" @keyup.enter="onLogin" />
                    <label class="label">
                        <span class="label-text-alt"></span>
                        <span class="label-text-alt link link-primary font-semibold tracer brightness-[1.40]"
                            @click="onDemo">
                            Demo?
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
                                xml:space="preserve">
                                <path
                                    d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
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
                    class="modal-action justify-center label-text-alt text-neutral-content/80 hover:text-neutral-content font-extralight link link-hover pb-2"
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
            <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
                Register.
            </h1>
            <p class="text-neutral-content/80 text-center text-sm">
                Join the party!
            </p>

            <div class="card-body pt-5 pb-1.5 bg-none">
                <div class="focus:text-base-content bg-none">
                    <label class="label-text text-neutral-content/80">Full Name</label>
                    <input v-model="signupData.fullname" required type="text" name="fullname"
                        class="form-control input input-bordered form-input auth-input" />
                    <label class="label-text text-neutral-content/80">Email</label>
                    <input v-model="signupData.email" required type="email" name="email"
                        class="form-control input input-bordered form-input auth-input" />
                    <label class="label-text text-neutral-content/80">Username</label>
                    <input v-model="signupData.username" required type="text" name="username"
                        class="form-control input input-bordered form-input auth-input" />
                    <label class="label-text text-neutral-content/80">Password</label>
                    <input v-model="signupData.password" required type="password" name="password"
                        class="form-control input input-bordered form-input auth-input" @keyup.enter="onRegister" />
                    <label class="label">
                        <span class="label-text-alt"></span>
                        <span class="label-text-alt link link-primary font-semibold tracer brightness-[1.40]"
                            @click="onDemo">
                            Demo?
                            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
                                xml:space="preserve">
                                <path
                                    d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
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
                    class="modal-action justify-center label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight link link-hover pb-2"
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
