<script setup lang="ts">
import { shortDate } from '~/utils/misc';

definePageMeta({
    middleware: ['auth'],
});

const client = useStrapiClient();
const { id: myId } = useStrapiUser().value as any;
const { strapi: { url: appHost }, weatherAPI } = useRuntimeConfig().public;

const { path } = useRoute();
const { toast } = useMisc();

const myEvents: Record<string, any> = ref([]);
const inviteCount = ref<number>();
const eventTab = ref<string>('all');

const isLoading = ref<boolean>(true);
// ----------------------------------------------------------------
onMounted(() => {
    isLoading.value = true;
    getMyEvents(myId);
});

watchEffect(() => {
    console.log('myEvents.value', myEvents.value);
});

// ----------------------------------------------------------------
async function getMyEvents(userId: number) {
    isLoading.value = true;
    try {
        const myEventsRes: Record<string, any> = await client(`${appHost}api/events?populate[0]=initiator.avatar&populate[1]=initiator.wallets&populate[2]=eventPic.url&populate[3]=invited_users.users_permissions_user&populate[4]=eventReceipt.receiptItem&populate[5]=location.zipcode&filters[invited_users][users_permissions_user][id][$in][0]=${userId}&sort=startDate`, {
            method: 'GET'
        });

        myEvents.value = await myEventsRes.data;

        inviteCount.value = myEvents.value.filter((event: Record<string, any>) => {
            return (event.attributes.initiator.data.id !== userId) && !pastEventCheck(event.attributes.startDate);
        }).length;
    } catch (error) {
        console.error(error);
    }
}

function mapEventsDestruct(userId: number) {
    try {
        return myEvents.value.map((event: any) => {
            const {
                id: eventId,
                attributes: {
                    title, partySize, startDate,
                    initiator: {
                        data: {
                            id: hostId,
                            attributes: {
                                username: host,
                                fullName: hostName,
                            }
                        }
                    },
                    eventPic: { data: { attributes: { url: coverUrl } } },
                    invited_users: { data: invites },
                    location: [{ zipcode }],
                }
            } = event;
            const hostAvatar = event.attributes.initiator.data.attributes?.avatar?.data?.attributes?.formats?.thumbnail?.url;
            // Event host details
            const [hostFirstName, ...rest] = hostName.split(/\s+/);
            const hostLastName = rest.join(' ');
            const hostInitials = hostName.split(/\s+/).map((name: string) => name[0].toUpperCase()).join('');
            // Find RSVPs to event
            const inviteUserId = invites.find((invite: Record<string, any>) => invite.attributes.users_permissions_user.data.id === userId);
            const eventStatus = inviteUserId?.attributes.eventStatus;
            // Event headcount (RSVP === 'going')
            const goingCount = invites.filter((invite: Record<string, any>) => {
                return invite.attributes.eventStatus === 'going';
            }).length;

            return { eventId, eventStatus, title, host, hostName, hostFirstName, hostLastName, hostInitials, hostId, hostAvatar, startDate, coverUrl, partySize, goingCount, zipcode };
        });
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

// async function getWeather(event: any) {
//     const today = new Date();
//     const eventDate = new Date(event.startDate);
//     const msDelta = eventDate.getTime() - today.getTime();

//     const weather: Record<string, any> = await client(`http://api.weatherapi.com/v1/forecast.json?key=${weatherAPI}&q=${event.zipcode}&days=10&aqi=no&alerts=no`, {
//         method: 'GET'
//     });

//     const forecast: string = await weather.current?.condition.text;
//     return forecast;
// }

function pastEventCheck(startDate: string) {
    const currentTime = new Date();
    const eventStart = new Date(startDate);
    return eventStart <= currentTime;
}
function clickEventPage(eventId: number) {
    navigateTo(`/events/${eventId}`);
}
function clickEventDisplay(type: string) {
    eventTab.value = type;
}
function eventDisplay(event: any) {
    return eventTab.value === 'isHost'
        ? (myId === event.hostId && !pastEventCheck(event.startDate))
        : (eventTab.value === 'isInvited')
            ? (myId !== event.hostId && !pastEventCheck(event.startDate))
            : (eventTab.value === 'inPast')
                ? (pastEventCheck(event.startDate))
                : !(pastEventCheck(event.startDate));
}

// ----------------------------------------------------------------
</script>

<template>
    <div class="pb-2">
        <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
            Your Events
        </h1>
        <p class="text-base-content/80 text-center text-sm">
            Someone's popular.
        </p>
    </div>

    <div class="flex justify-center pt-2">
        <div class="join">
            <input class="btn btn-sm join-item normal-case" :checked="eventTab === 'all'" type="radio" name="options"
                aria-label="Upcoming" @click="clickEventDisplay('all')" />
            <input class="btn btn-sm join-item normal-case" type="radio" name="options" aria-label="Host"
                @click="clickEventDisplay('isHost')" />

            <div class="indicator">
                <span v-if="inviteCount" class="indicator-item badge badge-sm badge-accent px-1 font-bold"
                    :class="inviteCount > 99 ? 'text-[0.6rem]' : ''">{{ inviteCount > 99 ? '99+' : inviteCount }}</span>
                <input class="btn btn-sm join-item normal-case" type="radio" name="options" aria-label="Invites"
                    @click="clickEventDisplay('isInvited')" />
            </div>

            <input class="btn btn-sm join-item normal-case" type="radio" name="options" aria-label="Past"
                @click="clickEventDisplay('inPast')" />
        </div>
    </div>

    <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-8 md:px-8 py-8">

        <div v-if="isLoading" class="flex justify-center col-span-4 pt-24">
            <Loader />
        </div>

        <div v-for="(ev, idx) in mapEventsDestruct(myId)" :key="idx" :class="eventDisplay(ev) ? '' : 'hidden'">
            <div v-if="eventDisplay(ev)" class="card card-compact bg-base-100 not-prose">

                <figure
                    class="hover:grayscale-0 hover:blur-none hover:scale-105 transitional-all ease-in-out duration-300  hover:cursor-pointer relative text-center"
                    :class="((ev.eventStatus === 'invited') && pastEventCheck(ev.startDate)) ? 'grayscale' : (ev.eventStatus === 'invited') ? 'blur-[1.83px]' : pastEventCheck(ev.startDate) ? 'grayscale' : ''"
                    @click="clickEventPage(ev.eventId)">

                        <img :src="ev.coverUrl" class="h-[200px] lg:h-[225px] w-full object-cover" />
                        <!-- <span class="absolute top-2 right-4 text-xl font-medium text-accent" :class="ev.eventStatus === 'invited' ? '' : 'hidden'">Invited</span> -->

                </figure>

                <div class="py-2.5 px-5">
                    <div class="pb-6">
                        <div class="flex justify-center">
                            <h1 class="text-primary text-2xl xl:text-[1.4rem] font-medium">{{ ev.title }}</h1>
                        </div>
                        <div class="flex justify-center">
                            <span class="font-semibold text-xs text-base-content/80 self-center">{{
                                shortDate(ev.startDate) }}</span>
                        </div>
                    </div>

                    <div class="flex justify-between pb-1.5">

                        <div class="flex justify-center items-center text-sm font-medium">
                            <div class="con-hint top-none sm:order-first ">
                                <div class="hint">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 fill-warning" viewBox="0 0 256 256">
                                        <path
                                            d="M246.46,73.17a16,16,0,0,0-17.74-2.26l-46.9,23.38-40-66.49a16.11,16.11,0,0,0-27.6,0l-40,66.49L27.31,70.92A16.1,16.1,0,0,0,4.82,90.35l37,113.35a12,12,0,0,0,17.51,6.61C59.57,210.17,84.39,196,128,196s68.43,14.19,68.62,14.3a12,12,0,0,0,17.57-6.58l37-113.29A16,16,0,0,0,246.46,73.17ZM195.53,183.52C182.18,178.4,159.2,172,128,172s-54.18,6.42-67.53,11.54l-27-82.71L70,119a16.18,16.18,0,0,0,21-6.11l37-61.49,37,61.5a16.18,16.18,0,0,0,21,6.1l36.52-18.2Zm-19.67-31A12,12,0,0,1,164,162.69a12.91,12.91,0,0,1-1.85-.14,229.32,229.32,0,0,0-68.34,0,12,12,0,0,1-3.66-23.72,253.38,253.38,0,0,1,75.66,0A12,12,0,0,1,175.86,152.52Z">
                                        </path>
                                    </svg>
                                </div>

                                <div v-if="ev.hostAvatar" class="inline avatar hover:cursor-pointer">
                                    <div class="w-8 rounded-full">
                                        <img :src="ev.hostAvatar" class="object-contain" />
                                    </div>
                                </div>

                                <div v-else class="flex items-center avatar hover:cursor-pointer">
                                    <div class="inline avatar placeholder w-8 rounded-full text-sm hover:cursor-pointer">
                                        <div class="bg-secondary">
                                            <span class="">{{ ev.hostInitials }}</span>
                                        </div>
                                    </div>
                                    <div class="flex bg-transparent font-medium text-primary text-xs md:text-sm">
                                    </div>
                                </div>
                            </div>

                            <span class="align-super pl-1.5 font-semibold">
                                {{ ev.hostFirstName }}
                                <span v-if="myId !== ev.hostId && ev.eventStatus === 'going'" class="font-medium">
                                    <span class="text-accent"> invited you!</span></span>
                            </span>
                        </div>

                        <div class="flex items-center text-xs font-semibold">
                            <!-- <svg xmlns="http://www.w3.org/2000/svg" class="inline-flex fill-base-content/80 w-5"
                                viewBox="0 0 256 256">
                                <path
                                    d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                                </path>
                            </svg> -->
                            <!-- <span v-if="ev.partySize !== 0" class="inline-flex pl-1.5">
                                <span class="text-primary">{{ ev.goingCount }}</span>/{{ ev.partySize }}
                            </span> -->
                            <span v-if="ev.partySize !== 0" class="inline-flex pl-1.5">
                                <span class="text-primary">{{ ev.partySize - ev.goingCount }}</span>/{{ ev.partySize }}
                                <span class="font-medium pl-0.5"> spots</span>
                            </span>
                            <span v-else-if="(ev.partySize - ev.goingCount) === 0" class="pl-1.5">full</span>
                            <span v-else-if="!ev.partySize" class="pl-1.5">open</span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
