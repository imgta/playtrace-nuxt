<script setup lang="ts">
const drawerPause = ref(false);

watchEffect(() => {
    console.log();
});
function openDrawer() {
    drawerPause.value = true;
}
function closeDrawer() {
    drawerPause.value = false;
}
</script>

<template>
    <div class="drawer">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
            <!-- Page content here -->
            <label for="my-drawer-4" class="btn drawer-button normal-case border-none hover:bg-transparent hover:border-none" @click="openDrawer()">
                <svg v-if="!drawerPause" class="fill-primary w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z"></path></svg>
                <svg v-if="drawerPause" class="fill-primary w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z"></path></svg>
                <div class="svg-wrap">
                <svg viewBox="0 0 400 20" xmlns="http://www.w3.org/2000/svg">
                    <path id="svg_line" d="m 1.986,8.91 c 55.429038,4.081 111.58111,5.822 167.11781,2.867 22.70911,-1.208 45.39828,-0.601 68.126,-0.778 28.38173,-0.223 56.76079,-1.024 85.13721,-1.33 24.17379,-0.261 48.42731,0.571 72.58115,0.571"></path>
                </svg>
                </div>
                <section class="link-svgline">
                    <p class="text-xl font-normal">
                        <a>trace.<svg class="link-svgline"><use xlink:href="#svg_line"></use></svg></a>
                    </p>
                </section>
            </label>

            <label for="my-drawer-4" class="btn drawer-button normal-case border-none hover:bg-transparent hover:border-none" @click="openDrawer()">
                <svg v-if="!drawerPause" class="fill-primary w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z"></path></svg>
                <svg v-if="drawerPause" class="fill-primary w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><path d="M200,28H160a20,20,0,0,0-20,20V208a20,20,0,0,0,20,20h40a20,20,0,0,0,20-20V48A20,20,0,0,0,200,28Zm-4,176H164V52h32ZM96,28H56A20,20,0,0,0,36,48V208a20,20,0,0,0,20,20H96a20,20,0,0,0,20-20V48A20,20,0,0,0,96,28ZM92,204H60V52H92Z"></path></svg>
                <span class="tracer text-xl font-normal">
                    trace.
                    <svg class="pl-1.5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
                                xml:space="preserve">
                                <path d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
                            </svg>
                        </span>
            </label>
        </div>
        <div class="drawer-side">
            <label for="my-drawer-4" class="drawer-overlay" @click="closeDrawer()"></label>
            <ul class="menu p-4 w-40 min-h-full bg-base-200/90 text-primary">
                <!-- Sidebar content here -->
                <li><a>Events</a></li>
                <li><a>New Event</a></li>

            </ul>
        </div>
    </div>
</template>
