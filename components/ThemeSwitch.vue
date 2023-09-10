<script setup lang="ts">
import { useColorMode, useCycleList } from '@vueuse/core';

const themeCookie = useCookie('selectedTheme');
const mode = useColorMode({
    selector: 'html',
    attribute: 'data-theme',
    emitAuto: true,
    modes: {
        fantasy: 'fantasy',
        night: 'night',
        corporate: 'corporate',
        dracula: 'dracula',
    },
});
const { state, next } = useCycleList(
    ['fantasy', 'night', 'corporate', 'dracula',],
    { initialValue: themeCookie.value });
// ----------------------------------------------------------------
watchEffect(() => {
    mode.value = state.value as any;
    themeCookie.value = state.value as any;
});
// ----------------------------------------------------------------
</script>

<template>
    <div class="flex-2 pr-1 align-middle">
        <button class="opacity-70" @click="next()">
            <div v-if="state === 'fantasy'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 256 256">
                    <path class="fill-primary"
                        d="M116 32V16a12 12 0 0 1 24 0v16a12 12 0 0 1-24 0Zm80 96a68 68 0 1 1-68-68a68.07 68.07 0 0 1 68 68Zm-24 0a44 44 0 1 0-44 44a44.05 44.05 0 0 0 44-44ZM51.51 68.49a12 12 0 1 0 17-17l-12-12a12 12 0 0 0-17 17Zm0 119l-12 12a12 12 0 0 0 17 17l12-12a12 12 0 1 0-17-17ZM196 72a12 12 0 0 0 8.49-3.51l12-12a12 12 0 0 0-17-17l-12 12A12 12 0 0 0 196 72Zm8.49 115.51a12 12 0 0 0-17 17l12 12a12 12 0 0 0 17-17ZM44 128a12 12 0 0 0-12-12H16a12 12 0 0 0 0 24h16a12 12 0 0 0 12-12Zm84 84a12 12 0 0 0-12 12v16a12 12 0 0 0 24 0v-16a12 12 0 0 0-12-12Zm112-96h-16a12 12 0 0 0 0 24h16a12 12 0 0 0 0-24Z">
                    </path>
                </svg>
            </div>
            <div v-if="state === 'dracula'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 256 256">
                    <path class="fill-primary"
                        d="M164 68c-1.66 0-3.31.06-4.95.16a75.93 75.93 0 0 0-58-62.23a12 12 0 0 0-14.37 14.38A52.05 52.05 0 0 1 24.3 82.68A12 12 0 0 0 9.93 97.07a76.61 76.61 0 0 0 27.91 43.27A56 56 0 0 0 84 228h80a80 80 0 0 0 0-160Zm-52.11-32a51.64 51.64 0 0 1 23.68 37.17a80.39 80.39 0 0 0-45.18 43.15A56.5 56.5 0 0 0 84 116a55.69 55.69 0 0 0-28.23 7.66a52.69 52.69 0 0 1-15.63-15.77A76.11 76.11 0 0 0 111.89 36ZM164 204H84a32 32 0 0 1 0-64h.28c-.11 1.1-.2 2.2-.26 3.3a12 12 0 0 0 24 1.4a55.78 55.78 0 0 1 1.74-11l.15-.55A56.06 56.06 0 1 1 164 204Z">
                    </path>
                </svg>
            </div>
            <div v-if="state === 'corporate'">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 256 256">
                    <path class="fill-primary"
                    d="M156 68a80.39 80.39 0 0 0-18.46 2.15a59.87 59.87 0 0 0-6-7.42l7.57-10.82a12 12 0 0 0-19.66-13.77L111.87 49a59.85 59.85 0 0 0-22.26-5l-2.3-13a12 12 0 0 0-23.63 4.17l2.3 13a60 60 0 0 0-19.21 12.3l-10.86-7.61a12 12 0 0 0-13.77 19.66L33 80.11a59.45 59.45 0 0 0-5 22.25l-13 2.3a12 12 0 0 0 2.07 23.82a12.59 12.59 0 0 0 2.1-.18l13-2.3a59.29 59.29 0 0 0 3.44 7.25A56 56 0 0 0 76 228h80a80 80 0 0 0 0-160Zm-68 0a36 36 0 0 1 26.45 11.61a80.37 80.37 0 0 0-32.06 36.75A56.5 56.5 0 0 0 76 116a55.84 55.84 0 0 0-20.33 3.83A36 36 0 0 1 88 68Zm68 136H76a32 32 0 0 1 0-64h.28c-.11 1.1-.2 2.2-.26 3.3a12 12 0 0 0 24 1.4a55.78 55.78 0 0 1 1.74-11l.15-.55A56.06 56.06 0 1 1 156 204Z">
                </path>
            </svg>
        </div>
        <div v-if="state === 'night'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 256 256">
                <path class="fill-primary"
                    d="M236.37 139.4a12 12 0 0 0-12-3A84.07 84.07 0 0 1 119.6 31.59a12 12 0 0 0-15-15a108.86 108.86 0 0 0-54.91 38.48A108 108 0 0 0 136 228a107.09 107.09 0 0 0 64.93-21.69a108.86 108.86 0 0 0 38.44-54.94a12 12 0 0 0-3-11.97Zm-49.88 47.74A84 84 0 0 1 68.86 69.51a84.93 84.93 0 0 1 23.41-21.22Q92 52.13 92 56a108.12 108.12 0 0 0 108 108q3.87 0 7.71-.27a84.79 84.79 0 0 1-21.22 23.41Z">
                </path>
            </svg>
        </div>
    </button>
</div>
</template>
