<script setup lang="ts">
// definePageMeta({
//     middleware: ['auth'],
// });
const { toast } = useMisc();
const targetText = '▶_trace.';
const token = useStrapiToken();
const { logout } = useStrapiAuth();
const { url: appHost } = useRuntimeConfig().public.strapi;
const themeCookie = useCookie('selectedTheme');
const expiry = new Date(Date.now() + 86400000); // expiry set to +1 day
const userCookie: any = useCookie('userCookie', { expires: expiry });

const client = useStrapiClient();
const user = useStrapiUser().value;
const myId = (user?.id) as number;
const userData = reactive({
    id: myId,
    username: '',
    fullName: '',
    initials: '',
    avatar: '',
}) as any;

// ----------------------------------------------------------------
onMounted(() => {
    getUser(myId);
});

// watchEffect(() => {
//     console.log('userData', userData);
// });
// ----------------------------------------------------------------
async function outClick() {
    try {
        logout();
    } catch (error) {
        console.error(error);
    } finally {
        toast.info('User logged out.', { timeout: 1500 });
        await navigateTo('/');
    }
}

async function getUser(userId: number) {
    // if (userCookie.value.id === myId) {
    //     userData.username = userCookie.value.username;
    //     userData.fullName = userCookie.value.fullName;
    //     userData.initials = userData.fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
    //     if (userCookie.value.avatar) {
    //         userData.avatar = userCookie.value.avatar;
    //     }
    // }

    try {
        const userRes: Record<string, any> = await client(`${appHost}api/users/${userId}?populate=*`, {
            method: 'GET'
        });
        const {
            username,
            fullName,
            avatar: { formats: { thumbnail: { url: avatarUrl } } },
        } = userRes;
        console.log('userRes', userRes);
        userData.username = username;
        userData.fullName = fullName;
        userData.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
        if (avatarUrl) {
            userData.avatar = avatarUrl;
        }
    } catch (error) {
        console.error(error);
    } finally {
        userCookie.value = userData;
    }
}

// ----------------------------------------------------------------
</script>

<template>
    <div :data-theme="themeCookie" class="flex flex-col min-h-screen bg-base-200">
        <div class="navbar bg-base-200 px-5">

            <div class="flex-1">
                <NuxtLink to="/">
                    <ScrambleFx :target-text="targetText" />
                </NuxtLink>
            </div>
            <ThemeSwitch />
            <div v-if="!token">
                <AuthModal />
            </div>

            <div v-if="token">
                <NuxtLink to="/events/new">
                        <button class="btn btn-primary text-primary bg-transparent hover:text-neutral-content border-none font-normal normal-case flex items-center btn-xs md:btn-sm">
                            <span>
                                Create
                            </span>
                        </button>
                </NuxtLink>
                <NuxtLink to="/events">
                    <button class="btn btn-primary text-primary bg-transparent hover:text-neutral-content border-none font-normal normal-case flex items-center btn-xs md:btn-sm">
                        <span>
                            Events
                        </span>
                    </button>
                </NuxtLink>

                <div class="navbar-center flex">
                    <ul class="menu menu-horizontal pl-1.5 bg-transparent">
                        <li tabIndex="{{0}}">

                            <div class="dropdown dropdown-hover bg-transparent py-0 pl-0 pr-1.5 hover:bg-transparent">

                                <NuxtLink v-if="userData.avatar" v-show="userData.avatar" to="/user/me">
                                    <div v-if="userData.avatar" v-show="userData.avatar" class="avatar iconDiv bg-transparent"
                                        :tooltip="userData.username">
                                        <img :src="userData.avatar" class="object-contain" />
                                    </div>
                                </NuxtLink>

                                <NuxtLink v-if="!userData.avatar" v-show="!userData.avatar" to="/user/me">
                                    <div v-if="!userData.avatar" v-show="!userData.avatar" class="avatar placeholder items-center">
                                        <div class="bg-secondary text-md font-normal rounded-full w-8">
                                            <span class="text-xs text-white">{{ userData.initials }}</span>
                                        </div>
                                        <span class="text-base-content/80 pl-2 text-md font-medium">{{ userData.username }}</span>
                                    </div>
                                </NuxtLink>

                                <ul
                                    class="dropdown-content z-[1] menu px-1 pt-3 m-0 bg-transparent border-none shadow-none drop-shadow-none right-0.5 top-6">
                                    <li>
                                        <LazyNuxtLink
                                            class="btn btn-xs btn-primary font-normal normal-case border-none hover:bg-primary px-2 pb-[1.2rem] pt-0.5"
                                            @click="outClick">
                                            <span class="text-neutral-content/90 text-sm link-hover">
                                                logout.
                                            </span>
                                        </LazyNuxtLink>
                                    </li>
                                </ul>

                            </div>
                        </li>
                    </ul>
                </div>
            </div>

        </div>

        <slot />

        <div class="bg-base-200 place-items-end mt-auto">
            <footer class="flex flex-nowrap pb-4 px-5 text-base-content max-w-none items-end">
                <div class="flex-initial pr-2">
                    <svg class="fill-current w-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd"
                        clip-rule="evenodd">
                        <path
                            d="M22.672 15.226l-2.432.811.841 2.515c.33 1.019-.209 2.127-1.23 2.456-1.15.325-2.148-.321-2.463-1.226l-.84-2.518-5.013 1.677.84 2.517c.391 1.203-.434 2.542-1.831 2.542-.88 0-1.601-.564-1.86-1.314l-.842-2.516-2.431.809c-1.135.328-2.145-.317-2.463-1.229-.329-1.018.211-2.127 1.231-2.456l2.432-.809-1.621-4.823-2.432.808c-1.355.384-2.558-.59-2.558-1.839 0-.817.509-1.582 1.327-1.846l2.433-.809-.842-2.515c-.33-1.02.211-2.129 1.232-2.458 1.02-.329 2.13.209 2.461 1.229l.842 2.515 5.011-1.677-.839-2.517c-.403-1.238.484-2.553 1.843-2.553.819 0 1.585.509 1.85 1.326l.841 2.517 2.431-.81c1.02-.33 2.131.211 2.461 1.229.332 1.018-.21 2.126-1.23 2.456l-2.433.809 1.622 4.823 2.433-.809c1.242-.401 2.557.484 2.557 1.838 0 .819-.51 1.583-1.328 1.847m-8.992-6.428l-5.01 1.675 1.619 4.828 5.011-1.674-1.62-4.829z" />
                    </svg>
                </div>
                <div class="flex-auto text-sm">
                    <span>Copyright © 2023 - All right reserved</span>
                </div>

                <a href="https://github.com/imgta">
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
    </div>
</template>
