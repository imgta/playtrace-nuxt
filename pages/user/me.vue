<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});
const { url: appHost } = useRuntimeConfig().public.strapi;
const { id: myId } = useStrapiUser().value as any;

const user = reactive({
    id: '',
    username: '',
    fullName: '',
    initials: '',
    avatar: '',
}) as any;
const popAvatar = ref<any | null>(null);
// ----------------------------------------------------------------
onMounted(() => {
    getUser(myId);
});
// ----------------------------------------------------------------
async function getUser(userId: number) {
    try {
        const userRes: any = await $fetch(`${appHost}api/users/${userId}?populate=*`);
        const { fullName, username } = await userRes;
        user.avatar = await userRes.avatar?.url;

        user.username = username;
        user.fullName = fullName;
        user.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
    } catch (e) {
        console.error(e);
    }
}

function openAvatar() {
    popAvatar.value.showModal();
}

console.log('user.avatar', user.avatar);
// ----------------------------------------------------------------
</script>

<template>
    <div class="flex justif-center">

        <div v-if="!user.avatar" class="avatar placeholder pl-10 pt-5">
            <div class="bg-secondary text-4xl font-normal rounded-full hover:opacity-70 cursor-pointer min-w-fit h-32 sm:h-40 md:h-48 lg:h-56 tracking-widest"
                @click="openAvatar">
                <span class=" ">{{ user.initials }}</span>
            </div>
        </div>
        <div v-if="!user.avatar" class="pl-3 pt-7">
            <span class="inline align-top text-xl">@{{ user.username }}</span>
            <div class="pl-3 pt-0.5">
                <span class="align-top text-sm">{{ user.fullName }}</span>
            </div>
        </div>

        <div v-if="user.avatar" class="avatar pl-10 pt-5">
            <div class="rounded-full hover:opacity-70 cursor-pointer min-w-fit h-32 sm:h-40 md:h-48 lg:h-56"
                @click="openAvatar">
                <img :src="user.avatar" class="object-cover" />
            </div>
            <div class="pl-4 pt-2.5 w-full">
                <p class="text-xl">@{{ user.username }}</p>
                <p class="text-sm pl-3 pt-0.5">{{ user.fullName }}</p>
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
