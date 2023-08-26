<script setup lang="ts">
import '@/assets/css/attach.css';
import Loader from '@/components/Loader.vue';
import CoverOptions from '@/components/events/CoverOptions.vue';

const gifs = ref<string[]>([]);
const eventGIF = ref('');
const modalVisible = ref(false);
const giphyQuery = ref('');
const loading = ref(false);
let giphyWait: ReturnType<typeof setTimeout> | null = null;
const giphyOffset = ref(0);
const gifLimit = 9;
const gifRef = ref<HTMLElement | null>(null);
const countAPI = ref(0);

const splashPage = ref(0);

// const userGifs = ref(await getGiphy(giphyQuery.value.trim(), 0, gifLimit));
// ----------------------------------------------------------------
async function getGiphy(query: string, offset: number, limit: number): Promise<string[]> {
    try {
        const config = useRuntimeConfig();
        const GIPHY_API = config.public.giphyAPI;
        const giphyRes: any = await $fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API}&q=${query}&limit=${limit}&offset=${offset}&bundle=clips_grid_picker`);
        // REGEX transform image URLs to grab raw .webp files
        const webpUrls: string[] = giphyRes.data.map((gif: any) => {
            const fullGif = gif.images.original.webp;
            return fullGif.replace(/https:\/\/media\d\.giphy\.com\/media\/([^\/?]+).*/, 'https://i.giphy.com/media/$1/giphy.webp');
        });
        return webpUrls;
    } catch (e: any) {
        console.error(e);
        return e.message;
    } finally {
        giphyOffset.value += gifLimit;
    }
}

// TODOs: Toggle for searching between GIPHY and Unsplash images
// Select image option for users: Upload/POST to Strapi > Display image as cover picture background
async function unSplash(query: string, page: number): Promise<string[]> {
    try {
        const config = useRuntimeConfig();
        const UNSPLASH_API = config.public.unSplashAPI;
        const splashRes: any = await $fetch(`https://api.unsplash.com/search/photos?client_id=${UNSPLASH_API}&query=${query}&page=${page}`);
        const splashImgs: string[] = splashRes.results.map((photo: any) => {
            const rawImg = photo.urls.raw;
            const jpgParams = '&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=75&w=600';
            return rawImg + jpgParams;
        });
        return splashImgs;
    } catch (e: any) {
        console.error(e);
        return e.message;
    }
}

// async function scrollMoreGifs() {
//     const trimQuery = giphyQuery.value.trim();
//     if (giphyOffset.value === gifs.value.length && trimQuery.length > 0) {
//         try {
//             await new Promise(res => setTimeout(res, 1500));
//             const webpUrls = await getGiphy(trimQuery, gifs.value.length, gifLimit);
//             gifs.value = gifs.value.concat(webpUrls);
//             // Increment fetch-offset value by fetch limit
//             giphyOffset.value += gifLimit;
//             countAPI.value += 1;
//             console.log('+EXTRA API CALL:', countAPI.value);
//             console.log('Offset:', giphyOffset.value);
//             console.log('GIFs Length:', gifs.value.length);
//             console.log('USER GIFs Length:', userGifs.value.length);
//         } catch (e) {
//             console.error(e);
//         }
//     };
// }
// onMounted(() => {
//     useInfiniteScroll(
//         gifRef,
//         async () => {
//             const gifArrLength = gifs.value.length;
//             const trimQuery = giphyQuery.value.trim();
//             const giphyDelay = trimQuery.length === 1 ? 2200 : 850;
//             if (trimQuery.length < 1 && gifs.value.length >= giphyOffset.value) {
//                 giphyOffset.value += gifLimit;
//                 loading.value = false;
//                 return ('error');
//             } else {
//                 giphyWait = setTimeout(async () => {
//                     try {
//                         const webpUrls = await getGiphy(trimQuery, gifArrLength, gifLimit);
//                         gifs.value = gifs.value.concat(webpUrls);

//                         countAPI.value += 1;
//                         console.log('+SCROLL API CALL:', countAPI.value);
//                         console.log('Offset:', giphyOffset.value);
//                         console.log('GIFs Length:', gifs.value.length);
//                         console.log('USER GIFs Length:', userGifs.value.length);
//                         modalVisible.value = true;
//                     } catch (e) {
//                         console.error(e);
//                     } finally {
//                         loading.value = false;
//                     }
//                 }, giphyDelay);
//             }
//         }, { distance: 10 }
//     );
// });

watch(giphyQuery, async userQuery => {
    // Reset offset value when query changes
    giphyOffset.value = 0;

    // Debouncing delay to prevent new API calls at each character input
    if (giphyWait) {
        clearTimeout(giphyWait);
        loading.value = true;
    }

    // Remove bordering whitespaces from query
    const trimQuery = userQuery.trim();
    const giphyDelay = trimQuery.length === 1 ? 2200 : 850;
    // Search query is: not empty, at least 1 character
    if (trimQuery.length > 0) {
        giphyWait = setTimeout(async () => {
            try {
                // const webpUrls = await getGiphy(userQuery, giphyOffset.value, gifLimit);
                const webpUrls = await unSplash(userQuery, 1);
                gifs.value = webpUrls;

                countAPI.value += 1;
                console.log('+API CALL:', countAPI.value);
                console.log('Offset:', giphyOffset.value);
                console.log('GIFs Length:', gifs.value.length);
                modalVisible.value = true;
            } catch (e) {
                console.error(e);
            } finally {
                loading.value = false;
            }
        }, giphyDelay);
    } else {
        // Clear GIFs grid and hide loading when query is empty
        loading.value = false;
        gifs.value = [];
    }
});

function selectGIF(gif: any) {
    eventGIF.value = gif.images.original.webp;
    modalVisible.value = false;
}
function openModal() {
    modalVisible.value = true;
}
function closeModal() {
    modalVisible.value = false;
}

console.log('API CALLs:', countAPI.value);
console.log('Offset:', giphyOffset.value);
console.log('GIFs Length:', gifs.value.length);
// ----------------------------------------------------------------
</script>

<template>
<div>
    <div class="flex justify-center items-center bg-base-200 p-3">
        <div>
        <CoverOptions />

        <input v-model="giphyQuery" type="search" class="input input-bordered input-primary w-full max-w-xs text-base-content/80 focus:placeholder-transparent focus:border-none focus:bg-inherit mr-3" placeholder="Search" />
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 fill-base-content/80" viewBox="0 0 256 256"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path></svg>
        </span>
        </div>
            <Loader v-if="loading" />
        <button class="edit edit-primary" @click="openModal">Cover Picture</button>
    </div>

    <div class="flex justify-center items-center bg-base-200">
        <div ref="gifRef" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center w-auto overflow-auto">
            <div v-for="(gif, index) in gifs" :key="index" @click="selectGIF(gif)">
                <img :src="gif" alt="IMG" class="w-[250px] h-auto" />
            </div>
        </div>
    </div>

    <div v-if="loading" class="justify-center items-center pt-5 bg-base-200">
        <Loader />
    </div>
</div>
</template>
