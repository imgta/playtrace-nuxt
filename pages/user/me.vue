<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});

const { myId, userData, getUser } = useAuth();
const popAvatar = ref<any | null>(null);
// ----------------------------------------------------------------
onMounted(() => {
    getUser(myId);
});
// ----------------------------------------------------------------
function openAvatar() {
    popAvatar.value.showModal();
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="flex justif-center">

        <div v-if="!userData.avatar" class="avatar placeholder pl-10 pt-5">
            <div class="bg-secondary text-4xl font-normal rounded-full hover:opacity-70 cursor-pointer min-w-fit h-32 sm:h-40 md:h-48 lg:h-56 tracking-widest"
                @click="openAvatar">
                <span>{{ userData.initials }}</span>
            </div>
        </div>
        <div v-if="!userData.avatar" class="pl-3 pt-7">
            <span class="inline align-top text-xl">@{{ userData.username }}</span>
            <div class="pl-3 pt-0.5">
                <span class="align-top text-sm">{{ userData.fullName }}</span>
            </div>
        </div>

        <div v-if="userData.avatar" class="avatar pl-10 pt-5">
            <div class="rounded-full hover:opacity-70 cursor-pointer min-w-fit h-32 sm:h-40 md:h-48 lg:h-56"
                @click="openAvatar">
                <img :src="userData.avatar" class="object-cover" />
            </div>
            <div class="pl-4 pt-2.5 w-full">
                <p class="text-xl">@{{ userData.username }}</p>
                <p class="text-sm pl-3 pt-0.5">{{ userData.fullName }}</p>
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
