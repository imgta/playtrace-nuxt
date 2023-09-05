<script setup lang="ts">
import { cardDate } from '~/utils/misc';

const client = useStrapiClient();
const myId = (useCookie('userCookie').value.id);
const userEvents: any = ref([]);

const eventArr: any = ref([]);
const zipRegex = /[0-9]{5}\b/;

async function getUser() {
    try {
        const config = useRuntimeConfig();
        const appHost = config.public.strapi.url;
        const userRes = await $fetch(`${appHost}api/users/${myId}?populate=*`);
        const userMe = await userRes as unknown | any;
        const { events } = userMe as any;
        const eventIds = events.map((event: any) => event.id);

        console.log('eventIds', eventIds);
        userEvents.value = eventIds;
        console.log(userEvents.value);
    } catch (e) {
        console.error(e);
    }
}

async function findEvents() {
    try {
        const eventRes: Record<string, any> = await client('http://localhost:1337/api/events?populate=*', {
            method: 'GET'
        });

        const eventSet = new Set(userEvents.value);

        eventArr.value = await eventRes.data.filter((event: any) => eventSet.has(event.id));
        console.log('eventArr', eventArr.value);
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
    const config = useRuntimeConfig();
    const WEATHER_API = config.public.weatherAPI;

    const today = new Date();
    const eventDate = new Date(date);

    const msDelta = eventDate - today;
    const daysDelta = Math.ceil(msDelta / (1000 * 60 * 60 * 24));
    console.log('daysDelta', daysDelta);

    try {
        if (daysDelta <= 10) {
            const weather: Record<string, any> = await client(`http://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API}&q=${zip}&days=10&aqi=no&alerts=no`);

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
    if (type === 'zip') {
        return (event.attributes.location).match(zipRegex)[0];
    }
    if (type === 'eventPic') {
        return event.attributes.eventPic.data.attributes.url;
    }
    if (type === 'cardDate') {
        return cardDate(event.attributes.startDate);
    }
    return event.attributes[type];
}

async function getWeather(event: any) {
    return new Promise(async (resolve, reject) => {
        try {
            const zipcode = await (event.attributes.location).match(zipRegex)[0];
            const eventDate = await event.attributes.startDate;
            const weather = await getForecast(zipcode, eventDate);
            resolve(weather);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
}

onMounted(() => {
    findEvents();
    getUser();
    getForecast('02210', '2023-09-17');
});
</script>

<template>
<div>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-8">
        <div v-for="ev in eventArr" :key="ev" class="card card-compact bg-base-100 not-prose">
            <figure>
                <img :src="getInfo(ev, 'eventPic')" class="h-[250px] w-full object-cover" />
            </figure>
            <div class="card-body">
                <h1 class="card-title self-center">{{ getInfo(ev, 'title') }}</h1>
                <span class="text-xs">{{ getInfo(ev, 'location') }}</span>
                <span class="text-xs">{{ getInfo(ev, 'zip') }}</span>
                <span class="text-xs">{{ getInfo(ev, 'cardDate') }}</span>
                <span class="text-xs">{{ getInfo(ev, 'info') }}</span>

                <div class="card-actions justify-end">
                    <div class="badge badge-outline text-xs">{{ ev.attributes.categories }}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
