<script setup lang="ts">
import { bolt, heart, infocon } from '@/utils/svgPack';

const { dashDate } = useDateTime();
const today = new Date();
const monthDay = dashDate(today.toDateString());
const router = useRouter();

const dashTitle = computed(() => {
    const pagePath = router.currentRoute.value.path;
    switch (pagePath) {
        case '/groups':
            return 'Your Groups';
        case '/groups/create':
            return 'Create A Group';
        case '/invites':
            return 'Your Invited';
        case '/receipts/upload':
            return 'Upload A Receipt';
        case '/dashboard':
            return 'Dashboard';
        default:
            return 'Page not found.';
    }
});
</script>

<template>
    <div class="bg-base-100 text-content flex h-screen">
        <div class="w-screen pl-40 pr-5">
            <div class="dashboard m-4 border-2 border-base-200 bg-base-200 px-9 pt-7 flex flex-col">
                <div class="dashboard-header flex text-base-content justify-between items-center mb-6">
                    <p class="font-normal text-primary text-3xl">
                        {{ dashTitle }}
                    </p>
                    <p class="date text-lg font-normal opacity-60">{{ monthDay }}</p>
                </div>
                <div class="dashboard-line self-center">
                    <div class="stats shadow">
                        <div class="stat">
                            <div class="stat-figure">

                                <component :is="heart" />

                            </div>
                            <div class="stat-title">Total Groups</div>
                            <div class="stat-value text-primary text-semibold">
                                25
                            </div>
                            <div class="stat-desc">With 40 friends</div>
                        </div>

                        <div class="stat">
                            <div class="stat-figure">

                                <component :is="bolt" />

                            </div>
                            <div class="stat-title">Circuits Wired</div>
                            <div class="stat-value text-accent">
                                10
                            </div>
                            <div class="stat-desc">Among 18 events</div>
                        </div>

                        <div class="stat">
                            <div class="stat-figure text-secondary">

                                <component :is="infocon" />

                            </div>
                            <div class="stat-title">Accept Rate</div>
                            <div class="stat-value text-primary">
                                86%
                            </div>

                            <div class="stat-desc">Out of 31 invites</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
