<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});
const route = useRoute();
const { toast } = useMisc();
const { userByUsername, profile, socials } = useProfile();
const popAvatar = ref<any | null>(null);
const pageUsername = route.params.username as string;
const { myUsername } = useAuth();
const showEdit = ref(false);
// ----------------------------------------------------------------
onMounted(() => {
    userByUsername(pageUsername); ;
});
watchEffect(() => {
    console.log('pageUsername', pageUsername);
    console.log('myUsername', myUsername);
    //
});
// ----------------------------------------------------------------
function openAvatar() {
    if (myUsername === pageUsername) {
        popAvatar.value.showModal();
    } else {
        toast.error('Invalid user.', { timeout: 1500 });
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="flex justif-center">

        <div v-if="!profile.avatar" class="avatar placeholder pl-10 pt-5">
            <div class="bg-secondary text-4xl font-normal rounded-full hover:opacity-70 cursor-pointer min-w-fit h-44 sm:h-48 md:h-56 lg:h-64 tracking-widest"
                @click="openAvatar" @mouseenter="showEdit = true" @mouseleave="showEdit = false">
                <span>{{ profile.initials }}</span>

                <div v-if="showEdit && pageUsername === myUsername"
                    class="absolute px-2 left-[44%] sm:left-[45%] bottom-[4%] badge badge-ghost badge-primary border border-primary bg-black/50 brightness-125">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="inline w-4 h-4 fill-primary">
                        <path
                            d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z">
                        </path>
                    </svg>
                    <span class="text-primary font-semibold text-sm pl-1 tracking-normal">Edit</span>
                </div>

            </div>

        </div>
        <div v-if="!profile.avatar" class="pl-3 pt-5">
            <div>
                <span class="inline align-top text-3xl font-medium tracking-tight">{{ profile.fullName }}</span>
            </div>
            <div class="inline items-center pl-1.5">

                <svg v-if="socials.linkedin" xmlns="http://www.w3.org/2000/svg"
                    class="inline mr-2 w-[1.55rem] fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary hover:cursor-pointer duration-300 ease-in-out"
                    viewBox="0 0 24 24">
                    <path
                        d="M0 0v24h24v-24h-24zm8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z" />
                </svg>

                <svg v-if="socials.github"
                    class="inline mr-2 w-7 fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary hover:cursor-pointer duration-300 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64">
                    <path
                        d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z">
                    </path>
                </svg>
                <svg v-if="socials.instagram"
                    class="inline w-7 fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary hover:cursor-pointer duration-300 ease-in-out"
                    xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256">
                    <path
                        d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,72a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM176,20H80A60.07,60.07,0,0,0,20,80v96a60.07,60.07,0,0,0,60,60h96a60.07,60.07,0,0,0,60-60V80A60.07,60.07,0,0,0,176,20Zm36,156a36,36,0,0,1-36,36H80a36,36,0,0,1-36-36V80A36,36,0,0,1,80,44h96a36,36,0,0,1,36,36ZM196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Z">
                    </path>
                </svg>

            </div>
        </div>

        <div v-if="profile.avatar" class="avatar pl-10 pt-5">
            <div class="rounded-full cursor-pointer min-w-fit h-44 sm:h-48 md:h-56 lg:h-64" @click="openAvatar"
                @mouseenter="showEdit = true" @mouseleave="showEdit = false">
                <div class="h-full">
                    <img :src="profile.avatar" class="object-cover" />
                    <div v-if="showEdit && pageUsername === myUsername"
                        class="absolute px-2 left-[26%] sm:left-[28%] md:left-[30%] bottom-[4%] badge badge-ghost badge-primary border border-primary bg-black/50 brightness-125">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="inline w-4 h-4 fill-primary">
                            <path
                                d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z">
                            </path>
                        </svg>
                        <span class="text-primary font-semibold text-sm pl-1">Edit</span>
                    </div>
                </div>

            </div>

            <div class="pl-4 pt-0 w-full">
                <p class="text-3xl font-medium tracking-tight text-primary pb-0.5">{{ profile.fullName }}</p>

                <div class="inline pl-1.5">
                    <a :href="socials.linkedin" target="_blank">
                        <svg v-if="socials.linkedin" xmlns="http://www.w3.org/2000/svg"
                            class="inline w-[1.55rem] fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary hover:cursor-pointer duration-300 ease-in-out mr-2"
                            viewBox="0 0 24 24">
                            <path
                                d="M0 0v24h24v-24h-24zm8 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                    </a>

                    <a :href="socials.github" target="_blank">
                        <svg v-if="socials.github"
                            class="inline w-7 fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary hover:cursor-pointer duration-300 ease-in-out mr-2"
                            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64">
                            <path
                                d="M32 6C17.641 6 6 17.641 6 32c0 12.277 8.512 22.56 19.955 25.286-.592-.141-1.179-.299-1.755-.479V50.85c0 0-.975.325-2.275.325-3.637 0-5.148-3.245-5.525-4.875-.229-.993-.827-1.934-1.469-2.509-.767-.684-1.126-.686-1.131-.92-.01-.491.658-.471.975-.471 1.625 0 2.857 1.729 3.429 2.623 1.417 2.207 2.938 2.577 3.721 2.577.975 0 1.817-.146 2.397-.426.268-1.888 1.108-3.57 2.478-4.774-6.097-1.219-10.4-4.716-10.4-10.4 0-2.928 1.175-5.619 3.133-7.792C19.333 23.641 19 22.494 19 20.625c0-1.235.086-2.751.65-4.225 0 0 3.708.026 7.205 3.338C28.469 19.268 30.196 19 32 19s3.531.268 5.145.738c3.497-3.312 7.205-3.338 7.205-3.338.567 1.474.65 2.99.65 4.225 0 2.015-.268 3.19-.432 3.697C46.466 26.475 47.6 29.124 47.6 32c0 5.684-4.303 9.181-10.4 10.4 1.628 1.43 2.6 3.513 2.6 5.85v8.557c-.576.181-1.162.338-1.755.479C49.488 54.56 58 44.277 58 32 58 17.641 46.359 6 32 6zM33.813 57.93C33.214 57.972 32.61 58 32 58 32.61 58 33.213 57.971 33.813 57.93zM37.786 57.346c-1.164.265-2.357.451-3.575.554C35.429 57.797 36.622 57.61 37.786 57.346zM32 58c-.61 0-1.214-.028-1.813-.07C30.787 57.971 31.39 58 32 58zM29.788 57.9c-1.217-.103-2.411-.289-3.574-.554C27.378 57.61 28.571 57.797 29.788 57.9z">
                            </path>
                        </svg>
                    </a>
                    <a :href="socials.instagram" target="_blank">
                        <svg v-if="socials.instagram"
                            class="inline w-7 fill-base-content hover:animate-pulse hover:scale-125 hover:fill-primary hover:cursor-pointer duration-300 ease-in-out"
                            xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 256 256">
                            <path
                                d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,72a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM176,20H80A60.07,60.07,0,0,0,20,80v96a60.07,60.07,0,0,0,60,60h96a60.07,60.07,0,0,0,60-60V80A60.07,60.07,0,0,0,176,20Zm36,156a36,36,0,0,1-36,36H80a36,36,0,0,1-36-36V80A36,36,0,0,1,80,44h96a36,36,0,0,1,36,36ZM196,76a16,16,0,1,1-16-16A16,16,0,0,1,196,76Z">
                            </path>
                        </svg>
                    </a>

                </div>
            </div>
        </div>
    </div>

    <dialog ref="popAvatar" class="modal">
        <div class="modal-box bg-base-200/90 grid justify-center">
            <ProfileModal />
        </div>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</template>
