<script setup lang="ts">
import { articleDate } from '~/utils/misc';

const myArr = ['Clothes', 'Elecontronics', 'Groceries'];
</script>

<template>
    <main>
        <div class="py-6 bg-base-100">
            <div class="flex-col max-w-5xl mx-auto hero-content lg:flex-row-reverse">
                <img
                    src="https://images.unsplash.com/photo-1518281053204-48de9654fb37"
                    class="rounded-lg shadow-2xl md:max-w-lg lg:max-w-md ml-2"
                >
                <div class="py-4 prose">
                    <span class="mb-0 font-bold text-2xl text-base-content">Your New Social Catalyst</span>
                    <p class="pl-1 m-0">{{ articleDate(new Date()) }}</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </p>
                    Leave your
                    <a class="link-primary" href="https://playtrace.app">
                        trace.
                    </a>
                </div>
            </div>
        </div>
        <div class="bg-base-200">
            <div class="max-w-5xl px-4 py-12 mx-auto prose">
                <h3 class="pb-4">
                    Reading List
                </h3>
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div v-for="entry in myArr" :key="entry" class="shadow-xl card card-compact bg-base-100 not-prose">
                        <figure class="overflow-hidden max-h-56">
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">
                                {{ entry }}
                            </h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
