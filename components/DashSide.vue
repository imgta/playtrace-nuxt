<script setup lang="ts">
import '@/assets/css/dashboard.css';
</script>

<template>
<nav class="sidebar px-1">
    <div class="bg-base-100 text-content content-center h-screen pr-1">
        <ul class="menu rounded-box pt-3">
            <li>
                <NuxtLink to="/dashboard">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="fill-base-content w-6"
                        viewBox="0 0 256 256"
                    >
                    <path d="M216,36H40A20,20,0,0,0,20,56V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A20,20,0,0,0,216,36Zm-4,24V92H44V60ZM44,116H92v80H44Zm72,80V116h96v80Z"></path>
                    </svg>
                <span class="text-base-content">Overview</span>
                </NuxtLink>
            </li>
            <li>
                <details close>
                    <summary class="shake group after:text-base-content after:opacity-40">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="fill-base-content w-6 group-hover:fill-secondary-focus"
                            viewBox="0 0 256 256"
                        >
                        <path d="M125.18,156.94a64,64,0,1,0-82.36,0,100.23,100.23,0,0,0-39.49,32,12,12,0,0,0,19.35,14.2,76,76,0,0,1,122.64,0,12,12,0,0,0,19.36-14.2A100.33,100.33,0,0,0,125.18,156.94ZM44,108a40,40,0,1,1,40,40A40,40,0,0,1,44,108Zm206.1,97.67a12,12,0,0,1-16.78-2.57A76.31,76.31,0,0,0,172,172a12,12,0,0,1,0-24,40,40,0,1,0-14.85-77.16,12,12,0,1,1-8.92-22.28,64,64,0,0,1,65,108.38,100.23,100.23,0,0,1,39.49,32A12,12,0,0,1,250.1,205.67Z"></path>
                        </svg>
                        <span class="text-base-content">Groups</span>
                    </summary>
                    <ul class="text-base-content">
                        <li>
                        <NuxtLink to="/groups">
                            <span class="text-base-content">My Groups</span>
                        </NuxtLink>
                        </li>
                        <li>
                        <NuxtLink to="/groups/create">
                            <span class="text-base-content">Create Group</span>
                        </NuxtLink>
                        </li>
                    </ul>
                </details>
            </li>
            <li>
                <NuxtLink to="/invites" class="shake group">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="fill-base-content w-6 group-hover:fill-accent-focus"
                        viewBox="0 0 256 256"
                    >
                    <path d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z"></path>
                    </svg>
                <div class="indicator">
                    <span class="indicator-item badge-sm rounded-full badge-accent bg-accent-focus text-xs px-1.5 text-neutral-content font-normal opacity-90">
                    <!-- {!invites ? "0" : invites} -->
                    </span>
                    <span class="mt-0 mr-2.5 text-base-content">Invites</span>
                </div>
                </NuxtLink>
            </li>
            <li>
                <details close>
                    <summary class="shake group after:text-base-content after:opacity-40 hover">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="fill-base-content w-6 group-hover:fill-info"
                            viewBox="0 0 256 256"
                        >
                        <path d="M68,100A12,12,0,0,1,80,88h96a12,12,0,0,1,0,24H80A12,12,0,0,1,68,100Zm12,52h96a12,12,0,0,0,0-24H80a12,12,0,0,0,0,24ZM236,56V208a12,12,0,0,1-17.37,10.73L192,205.42l-26.63,13.31a12,12,0,0,1-10.74,0L128,205.42l-26.63,13.31a12,12,0,0,1-10.74,0L64,205.42,37.37,218.73A12,12,0,0,1,20,208V56A20,20,0,0,1,40,36H216A20,20,0,0,1,236,56Zm-24,4H44V188.58l14.63-7.31a12,12,0,0,1,10.74,0L96,194.58l26.63-13.31a12,12,0,0,1,10.74,0L160,194.58l26.63-13.31a12,12,0,0,1,10.74,0L212,188.58Z"></path>
                        </svg>
                        <span class="text-base-content">Receipts</span>
                    </summary>
                    <ul class="text-base-content">
                        <li>
                        <a>My Receipts</a>
                        </li>
                        <li>
                        <NuxtLink to="/receipts/upload">
                            <span class="text-base-content mb-1">
                            Upload Receipt
                            </span>
                        </NuxtLink>
                        </li>
                    </ul>
                </details>
            </li>
            <li>
                <a class="shake">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="fill-base-content w-6 -scale-x-100"
                        viewBox="0 0 256 256"
                    >
                    <path d="M72,144a40,40,0,1,0,40,40A40,40,0,0,0,72,144Zm0,56a16,16,0,1,1,16-16A16,16,0,0,1,72,200ZM40,128a12,12,0,0,1-8.49-20.49L43,96,31.51,84.49a12,12,0,0,1,17-17L60,79,71.51,67.51a12,12,0,0,1,17,17L77,96l11.52,11.51a12,12,0,0,1-17,17L60,113,48.49,124.49A12,12,0,0,1,40,128Zm184.49,75.51a12,12,0,0,1-17,17L196,209l-11.51,11.52a12,12,0,0,1-17-17L179,192l-11.52-11.51a12,12,0,0,1,17-17L196,175l11.51-11.52a12,12,0,0,1,17,17L213,192Zm-43.4-92.62c-5.21,23-23.33,43.53-45.09,51.22a12,12,0,1,1-8-22.63c14.07-5,26.27-18.91,29.67-33.9,2.37-10.46.4-20.84-5.68-30.54v9a12,12,0,0,1-24,0V44a12,12,0,0,1,12-12h40a12,12,0,0,1,0,24H168C180.77,72.61,185.42,91.76,181.09,110.89Z"></path>
                    </svg>
                    <span class="text-base-content">Circuit</span>
                </a>
            </li>
        </ul>
    </div>
</nav>
</template>
