<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});

const route = useRoute();

// ----------------------------------------------------------------

// ----------------------------------------------------------------

// ----------------------------------------------------------------
</script>

<template>
    <Parrot />
    <!-- <div class="btm-nav text-sm font-medium">
        <button
            :class="(route.path === '/') ? 'fill-primary text-primary active' : 'fill-neutral-content/80 text-neutral-content/80 hover:fill-primary hover:text-primary hover:active'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
                <path
                    d="M221.56,100.85,141.61,25.38l-.16-.15a19.93,19.93,0,0,0-26.91,0l-.17.15L34.44,100.85A20.07,20.07,0,0,0,28,115.55V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V164h24v44a20,20,0,0,0,20,20h48a20,20,0,0,0,20-20V115.55A20.07,20.07,0,0,0,221.56,100.85ZM204,204H164V160a20,20,0,0,0-20-20H112a20,20,0,0,0-20,20v44H52V117.28l76-71.75,76,71.75Z" />
            </svg>
            <span class="btm-nav-label">Home</span>
        </button>

        <button :class="(route.path === '/events/new') ? 'fill-primary text-primary active' : 'fill-neutral-content/80 text-neutral-content/80 hover:fill-primary hover:text-primary hover:active'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
                <path
                    d="M208,28H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28Zm-4,176H52V52H204ZM76,128a12,12,0,0,1,12-12h28V88a12,12,0,0,1,24,0v28h28a12,12,0,0,1,0,24H140v28a12,12,0,0,1-24,0V140H88A12,12,0,0,1,76,128Z" />
            </svg>
            <span class="btm-nav-label">New Event</span>
        </button>
        <button :class="(route.path === '/events') ? 'fill-primary text-primary active' : 'fill-neutral-content/80 text-neutral-content/80 hover:fill-primary hover:text-primary hover:active'">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 256 256">
                <path
                    d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z" />
            </svg>
            <span class="btm-nav-label">Your Events</span>
        </button>
    </div> -->
</template>
