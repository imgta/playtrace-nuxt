<script setup lang="ts">
const emit = defineEmits(['coverPicInput', 'modalState']);
const gifs = ref<string[]>([]);
const pics = ref<string[]>([]);

const coverSelect = ref<string>('');
const coverQuery = ref<string>('');
const storedQuery = reactive({
    giphy: '',
    splash: '',
});

const loadingAPI = ref<boolean>(false);
let fetchDelay: ReturnType<typeof setTimeout> | null = null;

const giphyOffset = ref<number>(0);
const giphyLimit: number = 30; // GIPHY beta key max limit: 50

const splashPage = ref<number>(0);
const splashPerPage: number = 30; // Unsplash max limit: 30

const clickAPI = ref<string>('splash');
const countAPI = ref(0);

// ----------------------------------------------------------------
onMounted(async () => {
    if (!pics.value.length) {
        splashPage.value = 0;
        try {
            loadingAPI.value = true;
            const startQuery = 'party';
            const imgs = await unSplash(startQuery, splashPage.value, splashPerPage);
            pics.value = imgs;
            storedQuery.splash = startQuery;
            coverQuery.value = startQuery;
        } catch (e) {
            console.error(e);
        } finally {
            loadingAPI.value = false;
        }
    } else {
        loadingAPI.value = false;
    }
});

watch([coverQuery, clickAPI, loadingAPI], async ([userQuery, coverAPI, loading]) => {
    // Debouncing delay to prevent new API calls at each character input
    if (fetchDelay) {
        try {
            clearTimeout(fetchDelay);
            // console.log('delay', fetchDelay);
        } catch (error) {
            console.error(error);
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
                        loadingAPI.value = true;
                        try {
                            const imgs = await unSplash(userQuery, splashPage.value, splashPerPage);
                            pics.value = imgs;
                            storedQuery.splash = userQuery;
                        } catch (e) {
                            console.error(e);
                        } finally {
                            loadingAPI.value = false;
                        }
                    } else {
                        // console.log('stored:', storedQuery.splash);
                        loadingAPI.value = false;
                    }
                    // console.log('pics.value.length', pics.value.length);
                    // console.log('splashPage.value', splashPage.value);
                }, oneCharDelay);
            }
            if (coverAPI === 'giphy') {
                fetchDelay = setTimeout(async () => {
                    if (userQuery !== storedQuery.giphy || !gifs.value.length) {
                        // Reset GIPHY offset when query changes
                        giphyOffset.value = 0;
                        loadingAPI.value = true;
                        try {
                            const webpUrls = await getGiphy(userQuery, giphyOffset.value, giphyLimit);
                            gifs.value = webpUrls;
                            storedQuery.giphy = userQuery;
                        } catch (e) {
                            console.error(e);
                        } finally {
                            loadingAPI.value = false;
                        }
                    } else {
                        // console.log('stored:', storedQuery.giphy);
                        loadingAPI.value = false;
                    }

                    // console.log('gifs.value.length', gifs.value.length);
                    // console.log('giphyOffset.value', giphyOffset.value);
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

// ----------------------------------------------------------------
async function getGiphy(query: string, offset: number, limit: number): Promise<string[]> {
    loadingAPI.value = true;
    try {
        const { giphyAPI } = useRuntimeConfig().public;
        const giphyRes: any = await $fetch(`https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${giphyAPI}&limit=${limit}&offset=${offset}&bundle=clips_grid_picker`);
        // Transform image URLs to remove hover elements
        // Note: fetching .webp images breaks when query = 'cats'
        const gifUrls: string[] = giphyRes.data.map((gif: any) => {
            const fullGif = gif.images.original.url;
            const imgGif = fullGif.replace(
                /^https:\/\/media\d\.giphy\.com\/media\/([^\/?]+).*\??.*$/,
                'https://i.giphy.com/$1/giphy.gif'
            );
            return imgGif;
        });
        return gifUrls;
    } catch (e: any) {
        console.error(e);
        return e.message;
    } finally {
        giphyOffset.value += giphyLimit;
        countAPI.value += 1;
        loadingAPI.value = false;
        // console.log('countAPI.value', countAPI.value);
        // console.log('giphyOffset.value', giphyOffset.value);
    }
}

async function unSplash(query: string, page: number, perPage: number): Promise<string[]> {
    loadingAPI.value = true;
    try {
        const { unSplashAPI } = useRuntimeConfig().public;
        const splashRes: any = await $fetch(`https://api.unsplash.com/search/photos?client_id=${unSplashAPI}&query=${query}&page=${page}&per_page=${perPage}`);
        const splashImgs: string[] = splashRes.results.map((photo: any) => {
            const rawImg = photo.urls.raw;
            // Convert + resize raw images
            const jpgParams = '&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=70&w=600';
            return rawImg + jpgParams;
        });
        return splashImgs;
    } catch (e: any) {
        console.error(e);
        return e.message;
    } finally {
        splashPage.value += 1;
        countAPI.value += 1;
        loadingAPI.value = false;
        // console.log('countAPI.value', countAPI.value);
        // console.log('splashPage.value', splashPage.value);
    }
}

async function giphyMore() {
    loadingAPI.value = true;
    try {
        const moreGifs: any = await getGiphy(storedQuery.giphy, giphyOffset.value, giphyLimit);
        // Note: Masonry wall requires new items to be added this way, (non-reactive to .push(item))
        gifs.value = [...gifs.value, ...moreGifs];

        // Pseudo-refresh so Masonry wall renders without column gaps
        clickAPI.value = '';
        clickAPI.value = 'giphy';
    } catch (error) {
        console.error(error);
    } finally {
        loadingAPI.value = false;
    }
    return false;
}
async function unSplashMore() {
    loadingAPI.value = true;
    try {
        const moreImgs: any = await unSplash(storedQuery.splash, splashPage.value + 1, splashPerPage);
        pics.value = [...pics.value, ...moreImgs];

        // Pseudo-refresh so Masonry wall renders without column gaps
        clickAPI.value = '';
        clickAPI.value = 'splash';
    } catch (error) {
        console.error(error);
    } finally {
        loadingAPI.value = false;
    }
    return false;
}

function selectCover(img: string, pop: boolean) {
    const subString = '&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=70&w=600';
    const rawImg = img.replace(subString, '');
    coverSelect.value = rawImg;
    emit('coverPicInput', rawImg);
    emit('modalState', pop);
    console.log('COVER PIC:', coverSelect.value);
}

function unSplashClick() {
    if (clickAPI.value === 'giphy') {
        clickAPI.value = 'splash';
    }
}
function giphyClick() {
    if (clickAPI.value === 'splash') {
        clickAPI.value = 'giphy';
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="justify-center content-center self-center items-center px-2">

        <div class="flex justify-center items-center">
            <div class="pb-2">
                <h1 class="text-primary text-3xl text-center pt-4">
                    Select your event cover!
                </h1>
                <p class="text-base-content/80 text-center text-sm">
                    Images from Unsplash and GIPHY.
                </p>
            </div>
        </div>

        <div class="radio-tile-group pl-3">
            <div class="input-container cursor-pointer mx-5">
                <input id="photos" class="radio-button h-full w-full cursor-pointer" type="radio" name="radio-pic"
                    :checked="clickAPI === 'splash'" @click="unSplashClick" />
                <div class="radio-tile">
                    <div class="icon photos-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" class="group-hover:fill-primary pt-1 pl-0.5"
                            viewBox="0 0 26 26">
                            <path d="M7.5 6.75V0h9v6.75h-9zm9 3.75H24V24H0V10.5h7.5v6.75h9V10.5z" />
                        </svg>
                    </div>
                    <label for="photos" class="radio-tile-label cursor-pointer pt-1">Photo</label>
                </div>
            </div>
            <div class="input-container cursor-pointer mx-5">
                <input id="gifs" class="radio-button h-full w-full cursor-pointer" type="radio" name="radio-gif"
                    :checked="clickAPI === 'giphy'" @click="giphyClick" />
                <div class="radio-tile">
                    <div class="icon gifs-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 34"
                            class="group-hover:fill-base-content pt-1">
                            <g fill-rule="evenodd" clip-rule="evenodd">
                                <path fill="#00ff99" d="M0 3h4v29H0z"></path>
                                <path fill="#9933ff" d="M24 11h4v21h-4z"></path>
                                <path fill="#00ccff" d="M0 31h28v4H0z"></path>
                                <path fill="#fff35c" d="M0 0h16v4H0z"></path>
                                <path fill="#ff6666" d="M24 8V4h-4V0h-4v12h12V8"></path>
                                <path fill="#121212" opacity="0.4" d="M24 16v-4h4M16 0v4h-4"></path>
                            </g>
                        </svg>
                    </div>
                    <label for="gifs" class="radio-tile-label cursor-pointer pt-1">GIPHY</label>
                </div>
            </div>
        </div>

        <div class="flex justify-center items-center">
            <div class="query-container">
                <input v-model="coverQuery" type="search" class="input input-bordered input-primary form-input pl-9 search"
                    placeholder="Search" />
                <svg class="fill-base-content w-4" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M790.588 1468.235c-373.722 0-677.647-303.924-677.647-677.647 0-373.722 303.925-677.647 677.647-677.647 373.723 0 677.647 303.925 677.647 677.647 0 373.723-303.924 677.647-677.647 677.647Zm596.781-160.715c120.396-138.692 193.807-319.285 193.807-516.932C1581.176 354.748 1226.428 0 790.588 0S0 354.748 0 790.588s354.748 790.588 790.588 790.588c197.647 0 378.24-73.411 516.932-193.807l516.028 516.142 79.963-79.963-516.142-516.028Z"
                        fill-rule="evenodd"></path>
                </svg>
            </div>
        </div>

        <div v-if="loadingAPI" class="flex justify-center items-center">
            <Loader />
        </div>

        <div class="pt-6">
            <div v-if="clickAPI === 'splash'">
                <MasonryWall :items="pics" :ssr-columns="3" :min-columns="3" :column-width="275" :gap="2">
                    <template #default="{ item }">
                        <button>
                            <img :src="item" alt="PICs"
                                class="object-cover cursor-pointer hover:brightness-125 hover:contrast-75 hover:opacity-80"
                                @click="selectCover(item, false)" />
                        </button>
                    </template>
                </MasonryWall>
                <div class="flex justify-center pt-1">
                    <button class="btn btn-sm" @click="unSplashMore">Load More</button>
                </div>
            </div>
            <div v-if="clickAPI === 'giphy'">
                <MasonryWall :items="gifs" :ssr-columns="3" :min-columns="3" :column-width="275" :gap="2">
                    <template #default="{ item }">
                        <button>
                            <img :src="item" alt="GIFs"
                                class="object-contain cursor-pointer hover:brightness-110 hover:contrast-75 hover:opacity-90"
                                @click="selectCover(item, false)" />
                        </button>
                    </template>
                </MasonryWall>
                <div class="flex justify-center pt-1">
                    <button class="btn btn-sm" @click="giphyMore">Load More</button>
                </div>
            </div>
        </div>

    </div>
</template>
