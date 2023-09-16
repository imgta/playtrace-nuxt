<script setup lang="ts">
import { articleDate } from '~/utils/misc';

const myArr = ['Nuxt 3', 'Strapi', 'Vue.js'];
</script>

<template>
    <main>
        <div class="py-6 bg-base-100">
            <div class="flex-col max-w-5xl mx-auto hero-content lg:flex-row-reverse">
                <img src="https://images.unsplash.com/photo-1518281053204-48de9654fb37"
                    class="rounded-lg shadow-2xl md:max-w-lg lg:max-w-md">
                <div class="py-2 px-4 prose">
                    <span class="mb-0 font-bold text-2xl text-base-content">Your New Social Catalyst</span>
                    <p class="text-sm text-opacity-90 m-0">{{ articleDate(new Date()) }}</p>
                    <p class="text-justify text-sm sm:text-base">
                        Welcome to playTrace--a new social events hosting app that will help you embolden relationships, electrify social circles, and explore communities, candidly.
                    </p>
                    <span class="tracking-widest font-medium">Plan, play,
                    <NuxtLink to="/events/new" class="tracer pl-[0.2rem] tracking-wider">
                            trace.
                            <svg class="pl-1.5" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                                x="0px" y="0px" viewBox="0 0 152.9 43.4" style="enable-background:new 0 0 152.9 43.4;"
                                xml:space="preserve">
                                <path d="M151.9,13.6c0,0,3.3-9.5-85-8.3c-97,1.3-58.3,29-58.3,29s9.7,8.1,69.7,8.1c68.3,0,69.3-23.1,69.3-23.1 s1.7-10.5-14.7-18.4" />
                            </svg>
                    </NuxtLink>
                </span>
                </div>
            </div>
        </div>
        <div class="bg-base-200">
            <div class="max-w-5xl px-6 py-12 mx-auto prose">
                <h3 class="pb-2">
                    Tech Stack
                </h3>
                <div class="grid gap-6 grid-cols-1 lg:grid-cols-3">
                    <div v-for="entry in myArr" :key="entry" class="shadow-xl card card-compact bg-base-100 not-prose">
                        <figure class="overflow-hidden max-h-56">
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">
                                {{ entry }}
                            </h2>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
