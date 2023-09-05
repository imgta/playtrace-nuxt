<script setup lang="ts">
const myArr = ['Clothes', 'Elecontronics', 'Groceries'];

// toast.info('Success', { timeout: 1400 });
</script>

<template>
    <main>
        <div class="py-6 bg-base-100">
            <div class="flex-col max-w-5xl mx-auto hero-content lg:flex-row-reverse">
                <img
                    src="https://images.unsplash.com/photo-1528130723281-f9ffa133d787"
                    class="rounded-lg shadow-2xl md:max-w-lg lg:max-w-sm"
                >
                <div class="py-4 prose">
                    <p>BASED ON YOUR INTERESTS</p>
                    <h1>A New Social Catalyst</h1>
                    <p>Jan 7, 2022, 4pm</p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    </p>
                    <NuxtLink class="link-primary" to="/" external>
                        Go to backtab.dev
                    </NuxtLink>
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
        <!-- <Loading :my-loading="loading" /> -->
    </main>
</template>
