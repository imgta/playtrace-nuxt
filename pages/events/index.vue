<script setup lang="ts">
import { cardDate } from '~/utils/misc';

const client = useStrapiClient();
const { url: appHost } = useRuntimeConfig().public.strapi;
const userEvents: any = ref([]);

const user = useStrapiUser().value;
const myId = (user?.id) as number;
console.log('user', user);
// ----------------------------------------------------------------
onMounted(() => {
    findEvents(myId);
    getForecast('02210', '2023-09-17');
});
// ----------------------------------------------------------------
async function findEvents(userId: number) {
    try {
        const eventRes: Record<string, any> = await client(`${appHost}api/events?populate=*&filters[initiator][id][$in]=${userId}`, {
            method: 'GET'
        });
        userEvents.value = await eventRes.data;
        console.log('userEvents', userEvents.value);
    } catch (error) {
        console.error(error);
    }
}

function weatherDate(input: string): string {
    const date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month as it's 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function getForecast(zip: string, date: string) {
    const { weatherAPI } = useRuntimeConfig().public;
    const today: any = new Date();
    const eventDate: any = new Date(date);

    const msDelta = (eventDate - today);
    const daysDelta = Math.ceil(msDelta / (1000 * 60 * 60 * 24));
    console.log('daysDelta', daysDelta);
    try {
        if (daysDelta <= 10) {
            const weather: Record<string, any> = await client(`http://api.weatherapi.com/v1/forecast.json?key=${weatherAPI}&q=${zip}&days=10&aqi=no&alerts=no`);
            console.log('weather', weather);
            // Find the forecast for the specified date
            const target = await weather.forecast.forecastday.find((day: any) => day.date === weatherDate(date));
            const condition = await target.day.condition.text;
            console.log('condition', condition);
            return await condition;
        }
    } catch (error) {
        console.error(error);
    }
}

function getInfo(event: any, type: string) {
    if (type === 'eventPic') {
        return event.attributes.eventPic.data.attributes.url;
    }
    if (type === 'cardDate') {
        return cardDate(event.attributes.startDate);
    }
    if (type === 'location') {
        return event.attributes.location[0].fullAddress;
    }
    return event.attributes[type];
}
// ----------------------------------------------------------------
</script>

<template>
    <div>
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-8 pt-24">
            <div v-for="(ev, idx) in userEvents" :key="idx" class="card card-compact bg-base-100 not-prose">
                <figure>
                    <img :src="getInfo(ev, 'eventPic')" class="h-[225px] w-full object-cover" />
                </figure>
                <div class="card-body">
                    <h1 class="card-title self-center">{{ getInfo(ev, 'title') }}</h1>
                    <span class="text-xs">{{ getInfo(ev, 'location') }}</span>
                    <span class="text-xs">{{ getInfo(ev, 'cardDate') }}</span>
                    <span class="text-xs">{{ getInfo(ev, 'info') }}</span>

                    <div class="card-actions justify-end">
                        <div v-for="category in ev.attributes.location[0].category.split(', ')" :key="category"
                            class="badge badge-outline text-xs">{{ category }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
