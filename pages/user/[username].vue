<script setup lang="ts">
const user = reactive({
    id: '',
    username: '',
    fullName: '',
    initials: '',
    avatar: '',
}) as any;

const popAvatar = ref<any | null>(null);
// ----------------------------------------------------------------
async function getUser() {
    try {
        const config = useRuntimeConfig();
        const appHost = config.public.strapi.url;
        const { id } = useStrapiUser().value as any;
        user.id = id;
        const userRes = await $fetch(`${appHost}api/users/${id}?populate=*`);
        const userMe = await userRes as unknown | any;
        const { fullName, username, avatar } = userMe as any;
        user.username = username;
        user.fullName = fullName;
        user.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
        user.avatar = avatar?.url || '';
    } catch (e) {
        console.error(e);
    }
}

function openAvatar() {
    if (popAvatar.value) {
        popAvatar.value.showModal();
    }
}
// ----------------------------------------------------------------
onMounted(() => {
    getUser();
    console.log(user);
});
// ----------------------------------------------------------------
</script>

<template>
<div class="w-full h-full">
    <div class="grid grid-cols-3 gap-4">

        <div class="col-start-2 col-span-1">

            <div v-if="!user.avatar" v-show="!user.avatar" class="avatar placeholder items-center">
                    <div class="bg-secondary text-md font-normal rounded-full w-8" @click="openAvatar">
                        <span class="text-xs text-white">{{ user.initials }}</span>
                    </div>
                <span class="text-base-content/80 pl-2 text-md">{{ user.username }}</span>
            </div>

            <div v-if="user.avatar" v-show="user.avatar" class="avatar col-start-2">
                <div class="w-56 h-56 rounded-full hover:opacity-70 cursor-pointer" @click="openAvatar">
                        <img :src="user.avatar" />
                </div>
                <div class="pl-4 pt-5">
                    <p class="text-2xl">>{{ user.username }}</p>
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

    </div>
</div>
</template>
