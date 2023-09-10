<script setup lang="ts">
import { cardDate } from '~/utils/misc';

const client = useStrapiClient();
const { toast } = useMisc();
const { url: appHost } = useRuntimeConfig().public.strapi;

const myInvites: any = ref([]);
const user = useStrapiUser().value;
const myId = (user?.id) as number;
console.log('user', user);

// ----------------------------------------------------------------
onMounted(() => {
    getMyInvites(myId);
});
// ----------------------------------------------------------------
// async function getHostedEvents(userId: number) {
//     try {
//         const hostedRes: Record<string, any> = await client(`${appHost}api/events?populate=*&filters[initiator][id][$in]=${userId}`, {
//             method: 'GET'
//         });
//         hostedEvents.value = await hostedRes.data;
//         console.log('hostedEvents', hostedEvents.value);
//     } catch (error) {
//         console.error(error);
//     }
// }
// function weatherDate(input: string): string {
//     const date = new Date(input);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, '0'); // Add 1 to month as it's 0-based
//     const day = String(date.getDate()).padStart(2, '0');
//     return `${year}-${month}-${day}`;
// }

// async function getForecast(zip: string, date: string) {
//     const { weatherAPI } = useRuntimeConfig().public;
//     const today: any = new Date();
//     const eventDate: any = new Date(date);

//     const msDelta = (eventDate - today);
//     const daysDelta = Math.ceil(msDelta / (1000 * 60 * 60 * 24));
//     console.log('daysDelta', daysDelta);
//     try {
//         if (daysDelta <= 10) {
//             const weather: Record<string, any> = await client(`http://api.weatherapi.com/v1/forecast.json?key=${weatherAPI}&q=${zip}&days=10&aqi=no&alerts=no`);
//             console.log('weather', weather);
//             // Find the forecast for the specified date
//             const target = await weather.forecast.forecastday.find((day: any) => day.date === weatherDate(date));
//             const condition = await target.day.condition.text;
//             console.log('condition', condition);
//             return await condition;
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

async function getMyInvites(userId: number) {
    try {
        const allInvitesRes: Record<string, any> = await client(`${appHost}api/invited-users?populate=deep,4&filters[$and][0][collection][$eq]=event&filters[$and][1][users_permissions_user][id][$eq]=${userId}&sort=event.startDate`, {
            method: 'GET'
        });
        myInvites.value = await allInvitesRes.data;
        console.log('myInvites.value', myInvites.value);
    } catch (error) {
        console.error(error);
    }
}

async function deleteEvent(eventId: number) {
    try {
        // (1) Fetch and isolate target event data for cascade deletion
        const delEventRes: Record<string, any> = await client(`${appHost}api/events?populate=deep,3&filters[id][$eq]=${eventId}`, {
            method: 'GET'
        });
        const {
            id: delEventId,
            attributes: { eventPic: { data: { id: delEventPicId } } },
        } = await delEventRes.data[0];
        const delInviteIds = delEventRes.data[0].attributes.invited_users.data.map((invite: any) => invite.id);

        // (2a) Delete upload media file for eventPic (Strapi + AWS S3)
        try {
            const delEventPicRes: any = await client(`${appHost}api/upload/files/${delEventPicId}`, {
                method: 'DELETE',
            });
            console.log('delEventPicRes', await delEventPicRes);
        } catch (error) {
            console.error(error);
        } finally {
            toast.info('Event picture deleted!', { timeout: 1500 });
        }

        // (2b) Delete each invitedUser relational instance for target event
        try {
            const delInviteRequests = delInviteIds.map(async (id: number) => {
                const delInvitesRes: any = await client(`${appHost}api/invited-users/${id}`, {
                    method: 'DELETE',
                });
                const delInviteResult = await delInvitesRes.data;
                console.log('delInviteResult', delInviteResult);
            });
            await Promise.all(delInviteRequests);
        } catch (error) {
            console.error(error);
        } finally {
            toast.info('All associated invites deleted!', { timeout: 1500 });
        }

        // (2c) Finally, delete target event
        try {
            const delEventRes: any = await client(`${appHost}api/events/${delEventId}`, {
                method: 'DELETE',
            });
            const delEventResult = await delEventRes.data;
            console.log('delEventResult', delEventResult);
        } catch (error) {
            console.error(error);
        }
    } catch (error) {
        console.error(error);
    } finally {
        toast.info('Event deleted!', { timeout: 1500 });
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
        Your Events
    </h1>
    <p class="text-base-content/80 text-center text-sm">
        Someone's popular.
    </p>
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 px-8 pt-8">
        <div v-for="(ev, idx) in myInvites" :key="idx" class="card card-compact bg-base-100 not-prose">
            <figure>
                <img :src="ev.attributes.event.data?.attributes?.eventPic?.data?.attributes?.url"
                    class="h-[225px] w-full object-cover" />
            </figure>
            <div class="card-body">
                <h1 class="card-title self-center p-0">{{ ev.attributes.event.data?.attributes?.title }}</h1>

                <div class="flex text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content w-4" viewBox="0 0 256 256">
                        <path
                            d="M246.46,73.17a16,16,0,0,0-17.74-2.26l-46.9,23.38-40-66.49a16.11,16.11,0,0,0-27.6,0l-40,66.49L27.31,70.92A16.1,16.1,0,0,0,4.82,90.35l37,113.35a12,12,0,0,0,17.51,6.61C59.57,210.17,84.39,196,128,196s68.43,14.19,68.62,14.3a12,12,0,0,0,17.57-6.58l37-113.29A16,16,0,0,0,246.46,73.17ZM195.53,183.52C182.18,178.4,159.2,172,128,172s-54.18,6.42-67.53,11.54l-27-82.71L70,119a16.19,16.19,0,0,0,21-6.11l37-61.49,37,61.5a16.18,16.18,0,0,0,21,6.1l36.52-18.2Z">
                        </path>
                    </svg>
                    <span class="pl-1 font-extrabold">
                        {{ ev.attributes.event.data?.attributes?.initiator?.data?.attributes?.username }}
                        <span v-if="ev.attributes.eventStatus === 'invited'" class="font-normal">has invited you!</span>
                    </span>
                </div>

                <div class="flex text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content w-[0.95rem]" viewBox="0 0 256 256">
                        <path
                            d="M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z">
                        </path>
                    </svg>
                    <span class="pl-1">{{ ev.attributes.event.data?.attributes?.location[0]?.address }}</span>
                </div>

                <div class="flex text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content w-4" viewBox="0 0 256 256">
                        <path
                            d="M208,28H188V24a12,12,0,0,0-24,0v4H92V24a12,12,0,0,0-24,0v4H48A20,20,0,0,0,28,48V208a20,20,0,0,0,20,20H208a20,20,0,0,0,20-20V48A20,20,0,0,0,208,28ZM68,52a12,12,0,0,0,24,0h72a12,12,0,0,0,24,0h16V76H52V52ZM52,204V100H204V204Zm120.49-84.49a12,12,0,0,1,0,17l-48,48a12,12,0,0,1-17,0l-24-24a12,12,0,0,1,17-17L116,159l39.51-39.52A12,12,0,0,1,172.49,119.51Z">
                        </path>
                    </svg>
                    <span class="pl-1">{{ cardDate(ev.attributes.event.data?.attributes?.startDate) }}</span>
                </div>

                <div class="flex text-xs">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content w-4" viewBox="0 0 256 256"><path d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z"></path></svg>
                    <span class="pl-1">{{ ev.attributes.event.data?.attributes?.partySize }}</span>
                </div>

                <span class="pt-3">{{ ev.attributes.event.data?.attributes?.info }}</span>
                <!-- <span class="pt-3">EVENT ID: {{ ev.attributes.event.data?.id }}</span> -->

                <div class="flex flex-wrap gap-1.5 pt-6 items-end">
                    <span v-for="category in ev.attributes.event.data?.attributes?.location[0]?.category.split(', ')"
                        :key="category" class="badge badge-outline badge-xs categorytext font-semibold">{{ category
                        }}</span>

                    <div v-if="myId === ev.attributes.event.data?.attributes?.initiator?.data?.id"
                        class="ml-auto text-xs tooltip tooltip-error" data-tip="delete?" @click="deleteEvent(ev.attributes.event.data?.id)">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            class="fill-base-content/70 w-4 hover:fill-error hover:cursor-pointer" viewBox="0 0 256 256">
                            <path d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z"></path>
                        </svg>
                    </div>
                </div>

            </div>

        </div>
    </div>
</template>
