<script setup lang="ts">
import type { StrapiUser } from '@nuxtjs/strapi/dist/runtime/types';

const route = useRoute();
const { toast } = useMisc();

const { formBg, themeCookie, selectTheme } = useTheme();

const user = useStrapiUser() as Ref<StrapiUser>;
const myId = computed(() => { return user?.value?.id; });

const { userData, loginData, signupData, popLogin, popSignup, popRef, popModal, getUser, onDemo, onLogout, onLogin, onRegister } = useAuth();

const loginTheme = computed(() => selectTheme === 'corporate' ? 'logincorp auth-modal' : 'login auth-modal');
const signupTheme = computed(() => selectTheme === 'corporate' ? 'signupcorp auth-modal' : 'signup auth-modal');

const topNav = [
    {
        label: 'Create',
        link: '/events/new',
    },
    {
        label: 'Events',
        link: '/events',
    }
];
const bottomNav = [
    {
        label: 'Home',
        link: '/',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256"><path d="M221.56,100.85,141.61,25.38l-.16-.15a19.93,19.93,0,0,0-26.91,0l-.17.15L34.44,100.85A20.07,20.07,0,0,0,28,115.55V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V164h24v44a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V115.55A20.07,20.07,0,0,0,221.56,100.85ZM204,204H164V160a20,20,0,0,0-20-20H112a20,20,0,0,0-20,20v44H52V117.28l76-71.75,76,71.75Z" /></svg>',
    },
    {
        label: 'New Event',
        link: '/events/new',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256"><path d="M208,28H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28Zm-4,176H52V52H204ZM76,128a12,12,0,0,1,12-12h28V88a12,12,0,0,1,24,0v28h28a12,12,0,0,1,0,24H140v28a12,12,0,0,1-24,0V140H88A12,12,0,0,1,76,128Z" /></svg>',
    },
    {
        label: 'Your Events',
        link: '/events',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256"><path d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z" /></svg>',
    },
];

// ----------------------------------------------------------------

watch(myId, async () => {
    if (myId.value) { await getUser(myId.value); }
}, { immediate: true });

watch(() => route.path, () => { popRef.drawer = false; });

watch(() => popLogin.value, () => {
    if (route.fullPath.includes('?redirect')) {
        popModal('open', 'login');
        toast.error('Please login or register.', { timeout: 1500 });
    }
});

// ----------------------------------------------------------------

function activeNav(link: string) {
    return route.path === link ? 'fill-primary text-primary active font-semibold' : 'fill-base-content text-base-content hover:fill-primary hover:text-primary hover:active';
}
</script>

<template>
    <div :data-theme="themeCookie" class="flex flex-col min-h-screen bg-base-200">
        <div class="navbar bg-base-200 px-5">

            <div class="flex-1">
                <NuxtLink to="/">
                    <ScrambleFx target-text="▶_trace." />
                </NuxtLink>
            </div>
            <ThemeSwitch />

            <div v-if="!userData.id">
                <button class="btn-primary font-normal btn-outline btn-sm normal-case mt-0" @click="popModal('open', 'login')">
                    <span class="hover:text-neutral-content w-full h-full flex items-center">
                        Login
                    </span>
                </button>

                <dialog ref="popLogin" class="modal">
                    <div :class="formBg" method="dialog"
                        class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
                        <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
                            Sign in.
                        </h1>
                        <p class="text-neutral-content/80 text-center text-sm">
                            We've missed you!
                        </p>
                        <div class="card-body pt-5 pb-1.5 bg-none">

                            <div class="focus:text-base-content bg-none">

                                <label class="label-text text-xs text-neutral-content/80">username or email</label>
                                <input v-model="loginData.username" type="text" name="username"
                                    class="form-control input input-bordered form-input auth-input"
                                    @keyup.enter="onLogin" />
                                <label class="label-text text-xs text-neutral-content/80">password</label>
                                <input v-model="loginData.password" type="password" name="password"
                                    class="form-control input input-bordered form-input auth-input"
                                    @keyup.enter="onLogin" />
                                <label class="label">
                                    <span class="label-text-alt"></span>
                                    <span class="label-text-alt link link-primary font-semibold tracer brightness-[1.25]" @click="onDemo">
                                        Demo?
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;" xml:space="preserve"><path d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
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
                                @click="popModal('open', 'signup')">
                                C'mon, sign up already!
                            </button>

                        </div>
                    </div>
                    <form method="dialog" class="modal-backdrop">
                        <button @click="popModal('close', 'login')">close</button>
                    </form>
                </dialog>

                <button class="btn-primary btn-outline btn-sm" @click="popModal('open', 'signup')">
                    <div class="hover:text-neutral-content min-w-full h-full flex items-center">
                        Signup
                    </div>
                </button>

                <dialog ref="popSignup" class="modal">
                    <div :class="formBg" method="dialog"
                        class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
                        <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
                            Register.
                        </h1>
                        <p class="text-neutral-content/80 text-center text-sm">
                            Join the party!
                        </p>

                        <div class="card-body pt-5 pb-1.5 bg-none">
                            <div class="focus:text-base-content bg-none">
                                <label class="label-text text-xs text-neutral-content/80">full name</label>
                                <input v-model="signupData.fullName" required type="text" name="fullname"
                                    class="form-control input input-bordered form-input auth-input" />
                                <label class="label-text text-xs text-neutral-content/80">email</label>
                                <input v-model="signupData.email" required type="email" name="email"
                                    class="form-control input input-bordered form-input auth-input" />
                                <label class="label-text text-xs text-neutral-content/80">username</label>
                                <input v-model="signupData.username" required type="text" name="username"
                                    class="form-control input input-bordered form-input auth-input" />
                                <label class="label-text text-xs text-neutral-content/80">password</label>
                                <input v-model="signupData.password" required type="password" name="password"
                                    class="form-control input input-bordered form-input auth-input"
                                    @keyup.enter="onRegister" />
                                <label class="label">
                                    <span class="label-text-alt"></span>
                                    <span class="label-text-alt link link-primary font-semibold tracer brightness-[1.25]" @click="onDemo">
                                        Demo?
                                        <svg version="1.1" xmlns="http://www.w3.org/2000/svg"
                                            xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                                            viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
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
                                @click="popModal('open', 'login')">
                                Have we met before?
                            </button>

                        </div>

                    </div>

                    <form method="dialog" class="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </div>

            <div v-if="userData.id">
                <div class="hidden md:inline-flex">
                    <NuxtLink v-for="item in topNav" :key="item.label" :to="item.link">
                        <button class="btn btn-primary btn-xs text-primary bg-transparent hover:text-neutral-content border-none font-medium normal-case md:btn-sm">
                            <span>{{ item.label }}</span>
                        </button>
                    </NuxtLink>
                </div>

                <div class="navbar-center flex">
                    <div class="drawer drawer-end">
                        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" :checked="popRef.drawer"
                            @click="popRef.drawer = !popRef.drawer" />
                        <div class="drawer-content px-1">
                            <label for="my-drawer-4"
                                class="btn bg-transparent drawer-button normal-case border-none hover:bg-transparent hover:border-none px-0 pl-1">

                                <div v-if="userData.avatar && userData.avatar !== null" class="flex">
                                    <div class="avatar">
                                        <div class="max-h-[34px]"
                                            :class="popRef.drawer ? 'rounded-l-full w-[3.65rem]' : 'w-8 rounded-full'">
                                            <img :src="userData.avatar" class="object-contain" />
                                        </div>
                                    </div>
                                    <div class="flex bg-transparent font-medium text-primary text-xs md:text-sm">
                                        <span v-if="popRef.drawer" class="self-center pl-3">{{ userData.username }}</span>
                                    </div>
                                </div>

                                <div v-if="!userData.avatar && userData.avatar !== null" class="flex">
                                    <div class="avatar placeholder max-h-[34px]">
                                        <div v-if="popRef.drawer" class="bg-secondary rounded-l-full min-w-[3.65rem] text-sm">
                                            <span class="text-white self-center justify-center">
                                                {{ userData.initials }}
                                            </span>
                                        </div>
                                        <div v-if="!popRef.drawer" class="bg-secondary rounded-full w-8 text-xs">
                                            <span class="text-white self-center justify-center">
                                                {{ userData.initials }}
                                            </span>
                                        </div>

                                    </div>
                                    <div
                                        class="flex bg-transparent font-medium text-primary text-xs md:text-sm max-h-[34px] w-full">
                                        <span v-if="popRef.drawer" class="self-center pl-3 w-full">{{
                                            `${userData.username}` }} </span>
                                    </div>
                                </div>

                            </label>

                        </div>
                        <div class="drawer-side mt-16 z-10">
                            <label for="my-drawer-4" class="drawer-overlay"></label>
                            <ul
                                class="menu p-2 w-36 min-h-full bg-base-200 text-primary/80 content-center text-xs md:text-sm">
                                <!-- Sidebar content here -->
                                <li>
                                    <NuxtLink :to="userData.profileUrl" class="hover:text-primary link link-hover hover:bg-transparent">
                                        Profile
                                    </NuxtLink>
                                </li>
                                <li>
                                    <span class="hover:text-primary link link-hover hover:bg-transparent"
                                        @click="onLogout">
                                        Logout
                                    </span>
                                </li>

                            </ul>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <slot />

        <div class="bg-base-200 place-items-end mt-auto">
            <footer class="flex flex-nowrap pb-[4.5rem] md:pb-4 px-5 text-base-content max-w-none items-end">
                <div class="flex-initial pr-2">
                    <svg class="fill-current w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                        clip-rule="evenodd">
                        <path
                            d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z" />
                    </svg>
                </div>
                <div class="flex-auto text-sm">
                    <span>Copyright © {{ new Date().getFullYear() }} - All right reserved</span>
                </div>

                <a href="https://github.com/imgta/playtrace-nuxt">
                    <div class="flex-none">
                        <svg class="w-[30px] fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary duration-300 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64">
                            <path
                                d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z">
                            </path>
                        </svg>
                    </div>
                </a>
            </footer>

        </div>

        <!-- BOTTOM NAV BAR -->
        <div class="md:hidden btm-nav text-sm font-medium p-0 z-30">
            <NuxtLink v-for="item in bottomNav" :key="item.label" :to="item.link">
                <button :class="activeNav(item.link)">
                    <div class="flex justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256" v-html="item.icon"></svg>
                    </div>
                    <span class="btm-nav-label">{{ item.label }}</span>
                </button>
            </NuxtLink>
    </div>
</div>
</template>
