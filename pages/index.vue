<script setup lang="ts">
const { toast, loading } = useMisc()

toast.info('Success')
</script>

<template>
    <main>
        <div class="py-6 bg-base-100">
            <div class="flex-col max-w-5xl mx-auto hero-content lg:flex-row-reverse">
                <img
                    src="https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F13%2F2015%2F04%2F05%2Ffeatured.jpg&q=60"
                    class="rounded-lg shadow-2xl md:max-w-lg lg:max-w-sm"
                >
                <div class="py-4 prose">
                    <p>BASED ON YOUR READING HISTORY</p>
                    <h1>Designing search for mobile apps</h1>
                    <p>Jan 7, 2022, 4pm</p>
                    <p>
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
                        excepturi
                        exercitationem quasi.
                    </p>
                    <NuxtLink class="link-primary" href="/api/misc?blah=asdf" external>
                        Go to /api/misc?blah=asdf
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
                    <div class="shadow-xl card card-compact bg-base-100 not-prose">
                        <figure class="overflow-hidden max-h-56">
                            <img src="https://api.lorem.space/image/shoes" alt="Shoes">
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">
                                Shoes!
                            </h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                    <div class="shadow-xl card card-compact bg-base-100 not-prose">
                        <figure class="overflow-hidden max-h-56">
                            <img src="https://api.lorem.space/image/shoes" alt="Shoes">
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">
                                Shoes!
                            </h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                    <div class="shadow-xl card card-compact bg-base-100 not-prose">
                        <figure class="overflow-hidden max-h-56">
                            <img src="https://api.lorem.space/image/shoes" alt="Shoes">
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title">
                                Shoes!
                            </h2>
                            <p>If a dog chews shoes whose shoes does he choose?</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Loading :loading="loading" />
    </main>
</template>
