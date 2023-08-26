<script setup lang="ts">
import '@/assets/css/button.css';

const { login } = useStrapiAuth();
const { toast } = useMisc();

const popCover = ref<any | null>(null);
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;
const corpoLogin = ref('');

const gifs = ref([]);
const eventGIF = ref('');

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

async function openCover() {
    if (popCover.value) {
        popCover.value.showModal();
    }
    try {
        const GIPHY_API = process.env.GIPHY_KEY;
        const giphyRes = await $fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API}&q=party&limit=10&bundle=clips_grid_picker`);
        gifs.value = giphyRes.data;
    } catch (e) {
        console.error(e);
    }
}

function selectGIF(gif) {
    eventGIF.value = gif.images.original.webp;
}

function closeCover() {
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
<button class="btn-primary font-normal btn-outline btn-sm normal-case mt-0" @click="openCover">
    <span class="hover:text-neutral-content w-full h-full flex items-center">
        Cover Pic
    </span>
</button>
<dialog ref="popCover" class="modal">

    <form :class="formBg" method="dialog" class="modal-box w-auto max-fit px-9 pb-3 shadow-none">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Choose a GIF!
        </h1>
        <div class="card-body pt-5 pb-1.5 bg-none">
        <div class="gif-grid">
            <div v-for="(gif, index) in gifs" :key="index" class="gif-item" @click="selectGIF(gif)">
                <img :src="gif.images.original.webp" alt="GIF" />
            </div>
        </div>

        </div>
    </form>
    <form method="dialog" class="modal-backdrop">
        <button @click="closeCover">close</button>
    </form>
</dialog>
</template>
