<script setup lang="ts">
import '@/assets/css/attach.css';
import Loader from '@/components/Loader.vue';

const gifs = ref<string[]>([]);
const pics = ref<string[]>([]);

const modalVisible = ref(false);

const coverQuery = ref<string>('');
const storedQuery = reactive({
    giphy: '',
    splash: '',
});
const coverSelect = ref('');

const loadingAPI = ref<boolean>(false);
let fetchDelay: ReturnType<typeof setTimeout> | null = null;

const giphyOffset = ref<number>(0);
const giphyLimit = 30; // GIPHY beta key max limit: 50

const splashPage = ref<number>(0);
const splashPerPage = 30; // Unsplash max limit: 30

const clickAPI = ref<string>('splash');
const countAPI = ref(0);

// TODO: Upload/POST to Strapi (ON EVENT CREATE) > Display image as cover picture background
// ----------------------------------------------------------------
async function getGiphy(query: string, offset: number, limit: number): Promise<string[]> {
    try {
        const config = useRuntimeConfig();
        const GIPHY_API = config.public.giphyAPI;
        const giphyRes: Record<string, any> = await $fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API}&q=${query}&limit=${limit}&offset=${offset}&bundle=clips_grid_picker`);
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
        giphyOffset.value += 1;
        countAPI.value += 1;
        console.log('+API CALL:', countAPI.value);
        console.log('GIPHY Offset:', giphyOffset.value);
    }
}

async function unSplash(query: string, page: number, perPage: number): Promise<string[]> {
    try {
        const config = useRuntimeConfig();
        const UNSPLASH_API = config.public.unSplashAPI;
        const splashRes: Record<string, any> = await $fetch(`https://api.unsplash.com/search/photos?client_id=${UNSPLASH_API}&query=${query}&page=${page}&per_page=${perPage}`);
        const splashImgs: string[] = splashRes.results.map((photo: any) => {
            const rawImg = photo.urls.raw;
            // Convert + resize raw images
            const jpgParams = '&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=70&w=500';
            return rawImg + jpgParams;
        });
        return splashImgs;
    } catch (e: any) {
        console.error(e);
        return e.message;
    } finally {
        splashPage.value += 1;
        countAPI.value += 1;
        console.log('+API CALL:', countAPI.value);
        console.log('PICs Offset:', splashPage.value);
    }
}

watch([coverQuery, clickAPI, loadingAPI], async ([userQuery, coverAPI, loading]) => {
    // Debouncing delay to prevent new API calls at each character input
    if (fetchDelay) {
        try {
            clearTimeout(fetchDelay);
            console.log('delay', fetchDelay);
        } catch (e) {
            console.error(e);
        }
    }

    // Search query: has no bordering whitespaces, is not empty, at least 1 character
    const trimQuery = userQuery.trim();
    const oneCharDelay = trimQuery.length === 1 ? 2200 : 800;

    if (trimQuery.length > 0) {
        try {
            if (coverAPI === 'splash') {
                fetchDelay = setTimeout(async () => {
                    if (userQuery !== storedQuery.splash || !pics.value.length) {
                        // Reset Unsplash page offset when query changes
                        splashPage.value = 0;
                        try {
                            loadingAPI.value = true;
                            const imgs = await unSplash(userQuery, splashPage.value, splashPerPage);
                            pics.value = imgs;
                            storedQuery.splash = userQuery;

                            console.log('stored:', storedQuery.splash);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            loadingAPI.value = true;
                        }
                    } else {
                        console.log('stored:', storedQuery.splash);
                        loadingAPI.value = false;
                    }

                    console.log('PICs Length:', pics.value.length);
                    console.log('PIC offset:', splashPage.value);
                    console.log('total pics:', (splashPage.value * splashPerPage));
                }, oneCharDelay);
            }

            if (coverAPI === 'giphy') {
                fetchDelay = setTimeout(async () => {
                    if (userQuery !== storedQuery.giphy || !gifs.value.length) {
                        // Reset GIPHY offset when query changes
                        giphyOffset.value = 0;
                        try {
                            loadingAPI.value = true;
                            const webpUrls = await getGiphy(userQuery, giphyOffset.value, giphyLimit);
                            gifs.value = webpUrls;
                            storedQuery.giphy = userQuery;

                            console.log('stored:', storedQuery.giphy);
                        } catch (e) {
                            console.error(e);
                        } finally {
                            loadingAPI.value = true;
                        }
                    } else {
                        console.log('stored:', storedQuery.giphy);
                        loadingAPI.value = false;
                    }

                    console.log('GIFs Length:', gifs.value.length);
                    console.log('GIF offset:', giphyOffset.value);
                    console.log('total gifs:', (giphyLimit * giphyOffset.value));
                }, oneCharDelay);
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        loadingAPI.value = false;
        gifs.value = [];
        pics.value = [];
    }
    console.log('user query:', userQuery);
});

function selectCover(img: string) {
    coverSelect.value = img;
    modalVisible.value = false;
    console.log('COVER PIC:', coverSelect.value);
}
function openModal() {
    modalVisible.value = true;
}
function closeModal() {
    modalVisible.value = false;
}

// ----------------------------------------------------------------
</script>

<template>
<div>
    <div class="flex justify-center items-center bg-base-200 p-3">
        <div>
            <div>
                <div class="radio-tile-group">
                    <div class="input-container cursor-pointer" @click="clickAPI = 'splash'">
                    <input id="photos" class="radio-button" type="radio" name="radio-pic" :checked="clickAPI === 'splash'">
                    <div class="radio-tile">
                        <div class="icon photos-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content w-20 group-hover:fill-primary" viewBox="0 0 256 256">
                            <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"></path>
                            </svg>
                        </div>
                        <label for="photos" class="radio-tile-label cursor-pointer">Photo</label>
                    </div>
                    </div>

                    <div class="input-container cursor-pointer" @click="clickAPI = 'giphy'">
                    <input id="gifs" class="radio-button" type="radio" name="radio-gif" :checked="clickAPI === 'giphy'">
                    <div class="radio-tile">
                        <div class="icon gifs-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" class="fill-primary w-20 group-hover:fill-base-content" viewBox="0 0 256 256"><path d="M111.49,52.63a15.8,15.8,0,0,0-26,5.77L33,202.78A15.83,15.83,0,0,0,47.76,224a16,16,0,0,0,5.46-1l144.37-52.5a15.8,15.8,0,0,0,5.78-26Zm-8.33,135.21-35-35,13.16-36.21,58.05,58.05Zm-55,20,14-38.41,24.45,24.45ZM156,168.64,87.36,100l13-35.87,91.43,91.43ZM160,72a37.8,37.8,0,0,1,3.84-15.58C169.14,45.83,179.14,40,192,40c6.7,0,11-2.29,13.65-7.21A22,22,0,0,0,208,23.94,8,8,0,0,1,224,24c0,12.86-8.52,32-32,32-6.7,0-11,2.29-13.65,7.21A22,22,0,0,0,176,72.06,8,8,0,0,1,160,72ZM136,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm101.66,82.34a8,8,0,1,1-11.32,11.31l-16-16a8,8,0,0,1,11.32-11.32Zm4.87-42.75-24,8a8,8,0,0,1-5.06-15.18l24-8a8,8,0,0,1,5.06,15.18Z"></path></svg>
                        </div>
                        <label for="gifs" class="radio-tile-label cursor-pointer">GIFs</label>
                    </div>
                    </div>
                </div>
            </div>

        <input v-model="coverQuery" type="search" class="input input-bordered input-primary w-full max-w-xs text-base-content/80 focus:placeholder-transparent focus:border-none focus:bg-inherit mr-3" placeholder="Search" />

        </div>

            <Loader v-if="loadingAPI === true" />
        <button class="edit edit-primary" @click="openModal">Cover Picture</button>
    </div>

    <div class="flex justify-center items-center bg-base-200">

        <div v-if="clickAPI === 'splash'" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center w-auto overflow-auto">
            <div v-for="(pic, index) in pics" :key="index">
                <img :src="pic" alt="PICs" class="w-[200px] h-auto cursor-pointer" @click="selectCover(pic)" />
            </div>
        </div>

        <div v-if="clickAPI === 'giphy'" class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 items-center w-auto overflow-auto">
            <div v-for="(gif, index) in gifs" :key="index">
                <img :src="gif" alt="GIFs" class="w-[200px] h-auto cursor-pointer" @click="selectCover(gif)" />
            </div>
        </div>

    </div>

    <div class="justify-center items-center pt-5 bg-base-200">
        <Loader v-if="loadingAPI === true" />
    </div>
</div>
</template>
