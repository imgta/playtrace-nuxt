<script setup lang="ts">
import { cardDate, shortDate } from '~/utils/misc';

const client = useStrapiClient();
const { toast } = useMisc();
const { url: appHost } = useRuntimeConfig().public.strapi;
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;

const popDelete = ref<any | null>(null);

const popRsvp = ref<any | null>(null);
const rsvpModal = ref(false);
// const rsvpPick = ref('');

const myInvites: any = ref([]);
const user = useStrapiUser().value;
const myId = (user?.id) as number;
console.log('user', user);

// ----------------------------------------------------------------
onMounted(() => {
    getMyInvites(myId);
});
const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-slate-800/95 brightness-125': pageTheme === 'corporate' || 'fantasy',
    };
});
watchEffect(() => {
    console.log('myInvites.value', myInvites.value);
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

function openDelete(eventIdx: number) {
    if (popDelete.value) {
        popDelete.value[eventIdx].showModal();
    }
}
function closeDelete(eventIdx: number) {
    if (popDelete.value) {
        popDelete.value[eventIdx].close();
    }
}

function openRsvp(eventIdx: number) {
    if (popRsvp.value) {
        popRsvp.value[eventIdx].showModal();
        rsvpModal.value = true;
    }
}
function closeRsvp(eventIdx: number) {
    if (popRsvp.value) {
        popRsvp.value[eventIdx].close();
        rsvpModal.value = false;
    }
}
function rsvpHint(rsvpStatus: string, css: boolean) {
    if (!css) {
        if (rsvpStatus === 'going') {
            return 'Going!';
        } else if (rsvpStatus === 'maybe') {
            return 'Maybe?';
        } else if (rsvpStatus === 'noGo') {
            return 'Flaked.';
        } else {
            return 'Invited!';
        }
    } else {
        if (rsvpStatus === 'going') {
            return 'text-success font-semibold';
        } else if (rsvpStatus === 'maybe') {
            return 'text-accent font-semibold';
        } else if (rsvpStatus === 'noGo') {
            return 'text-error font-semibold';
        } else {
            return 'text-info font-semibold';
        }
    }
}

async function rsvpEvent(eventIdx: number, inviteId: number, rsvp: string) {
    const rsvpForm = new FormData();
    const rsvpObj = {
        eventStatus: `${rsvp}`
    };
    rsvpForm.append('data', JSON.stringify(rsvpObj));
    try {
        const rsvpRes: Record<string, any> = await client(`${appHost}api/invited-users/${inviteId}`, {
            method: 'PUT',
            body: rsvpForm,
        });
        const rsvpData = await rsvpRes.data;
        console.log('rsvpData', rsvpData);
        closeRsvp(eventIdx);
    } catch (error) {
        console.error(error);
    } finally {
        if (rsvp === 'going') {
            toast.success('RSVP: Going!', { timeout: 1500 });
        } else if (rsvp === 'maybe') {
            toast.warning('RSVP: Maybe?', { timeout: 1500 });
        } else if (rsvp === 'noGo') {
            toast.error('RSVP: Not going.', { timeout: 1500 });
        }
        await getMyInvites(myId);
        await navigateTo('/events');
    }
};

async function deleteEvent(eventId: number, eventIdx: number) {
    try {
        closeDelete(eventIdx);
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
        await getMyInvites(myId);
        await navigateTo('/events');
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="pb-2">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Your Events
        </h1>
        <p class="text-base-content/80 text-center text-sm">
            Someone's popular.
        </p>
    </div>

    <div class="flex justify-center pt-2">
        <ul class="menu menu-horizontal bg-base-200 rounded-box">
            <li><a class="active">All</a></li>
            <li><a>Hosting</a></li>
            <li><a>Past</a></li>
        </ul>
    </div>

    <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-8 py-8">
        <div v-for="(ev, idx) in myInvites" :key="idx" class="card card-compact bg-base-100 not-prose">
            <figure>
                <img :src="ev.attributes.event.data?.attributes?.eventPic?.data?.attributes?.url"
                    class="sm:h-[150px] md:h-[200px] lg:h-[225px] w-full object-cover" />
            </figure>
            <div class="card-body">
                <div>
                    <div class="flex justify-center py-0 my-0">
                        <h1 class="text-primary text-2xl font-medium">{{ ev.attributes.event.data?.attributes?.title }}</h1>
                    </div>
                    <div class="flex justify-center py-0 my-0">
                        <span class="font-semibold text-xs text-base-content/80 self-center">{{
                            shortDate(ev.attributes.event.data?.attributes?.startDate) }}</span>
                    </div>
                </div>

                <div class="flex text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        :class="myId === ev.attributes.event.data?.attributes?.initiator?.data?.id ? 'fill-accent w-4' : 'fill-base-content/75 w-4'"
                        viewBox="0 0 256 256">
                        <path
                            d="M246.46,73.17a16,16,0,0,0-17.74-2.26l-46.9,23.38-40-66.49a16.11,16.11,0,0,0-27.6,0l-40,66.49L27.31,70.92A16.1,16.1,0,0,0,4.82,90.35l37,113.35a12,12,0,0,0,17.51,6.61C59.57,210.17,84.39,196,128,196s68.43,14.19,68.62,14.3a12,12,0,0,0,17.57-6.58l37-113.29A16,16,0,0,0,246.46,73.17ZM195.53,183.52C182.18,178.4,159.2,172,128,172s-54.18,6.42-67.53,11.54l-27-82.71L70,119a16.18,16.18,0,0,0,21-6.11l37-61.49,37,61.5a16.18,16.18,0,0,0,21,6.1l36.52-18.2Zm-19.67-31A12,12,0,0,1,164,162.69a12.91,12.91,0,0,1-1.85-.14,229.32,229.32,0,0,0-68.34,0,12,12,0,0,1-3.66-23.72,253.38,253.38,0,0,1,75.66,0A12,12,0,0,1,175.86,152.52Z">
                        </path>
                    </svg>
                    <span class="pl-1.5 font-bold">
                        {{ ev.attributes.event.data?.attributes?.initiator?.data?.attributes?.username }}
                        <span v-if="ev.attributes.eventStatus === 'invited'" class="font-medium"> invited you!</span>
                    </span>
                </div>

                <div class="flex text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content/75 w-4" viewBox="0 0 256 256">
                        <path
                            d="M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z">
                        </path>
                    </svg>
                    <div v-if="ev.attributes.event.data?.attributes?.location[0]?.address">
                        <span v-if="ev.attributes.eventStatus === 'going'" class="pl-1.5">{{
                            ev.attributes.event.data?.attributes?.location[0]?.address }}</span>
                        <span v-if="ev.attributes.eventStatus !== 'going'" class="pl-1.5">RSVP to reveal.</span>
                    </div>
                    <div v-if="!ev.attributes.event.data?.attributes?.location[0]?.address">
                        <span v-if="ev.attributes.eventStatus === 'going'" class="pl-1.5">TBD</span>
                        <span v-if="ev.attributes.eventStatus !== 'going'" class="pl-1.5">RSVP to reveal.</span>
                    </div>
                </div>

                <div class="flex text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content/75 w-4" viewBox="0 0 256 256">
                        <path
                            d="M228,108.4a20,20,0,0,0,16-19.59V64a20,20,0,0,0-20-20H32A20,20,0,0,0,12,64V88.81A20,20,0,0,0,28,108.4a20,20,0,0,1,0,39.2,20,20,0,0,0-16,19.59V192a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V167.19a20,20,0,0,0-16-19.59,20,20,0,0,1,0-39.2ZM36,170.34a44,44,0,0,0,0-84.68V68H84V188H36Zm184,0V188H108V68H220V85.66a44,44,0,0,0,0,84.68Z">
                        </path>
                    </svg>

                    <span v-if="ev.attributes.event.data?.attributes?.coverCharge !== 0" class="pl-1.5">${{
                        ev.attributes.event.data?.attributes?.coverCharge }} cover</span>
                    <span v-if="ev.attributes.event.data?.attributes?.coverCharge === 0" class="pl-1.5">Free</span>
                </div>

                <div class="flex text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content/75 w-4" viewBox="0 0 256 256">
                        <path
                            d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                        </path>
                    </svg>
                    <span v-if="ev.attributes.event.data?.attributes?.partySize !== 0" class="pl-1.5">{{
                        ev.attributes.event.data?.attributes?.partySize }} spots left</span>
                    <span v-if="ev.attributes.event.data?.attributes?.partySize === 0" class="pl-1.5">Open</span>
                </div>

                <!-- CATEGORY TAGS -->
                <div class="flex gap-0.5 pt-5 pb-0 items-end">
                    <span v-for="category in ev.attributes.event.data?.attributes?.location[0]?.category.split(', ')"
                        :key="category"
                        class="badge badge-outline badge-xs categorytext font-semibold text-center align-middle opacity-80">
                        {{ category }}
                    </span>

                    <!-- DELETE EVENT MODAL -->
                    <div v-if="myId === ev.attributes.event.data?.attributes?.initiator?.data?.id"
                        class="ml-auto con-hint event-card" @click="openDelete(idx)">
                        <svg class="w-4 fill-base-content/75 hover:fill-error hover:cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                            <path
                                d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z">
                            </path>
                        </svg>
                    </div>
                    <dialog ref="popDelete" class="modal">
                        <div :class="formBg" method="dialog" class="modal-box w-auto max-fit px-9 py-3 pb-8 shadow-none">
                            <h1 class="text-primary text-2xl text-center pt-4 pb-0">
                                {{ ev.attributes.event.data?.attributes?.title }}
                            </h1>
                            <div class="flex justify-center items-center w-full pb-5">
                                <span class="text-neutral-content/80 text-center text-base font-normal">Delete event?</span>
                            </div>

                            <div class="grid grid-cols-2 justify-center items-center w-full text-neutral-content/75">

                                <div class="col-start-1 hover:cursor-pointer w-full group"
                                    @click="deleteEvent(ev.attributes.event.data?.id, idx)">
                                    <div class="flex justify-center group-hover:text-primary group-hover:font-semibold">
                                        <span class="pr-1">Yes</span>
                                        <svg class="fill-neutral-content/75 w-4 pb-[0.2rem] group-hover:fill-primary group-hover:animate-bounce inline"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                            <path
                                                d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>

                                <div class="col-start-2 hover:cursor-pointer w-full group" @click="closeDelete(idx)">
                                    <div class="flex justify-center group-hover:text-error group-hover:font-semibold">
                                        <span class="pr-1">No</span>
                                        <svg class="fill-neutral-content/75 w-4 group-hover:fill-error group-hover:animate-bounce inline"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                            <path
                                                d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z">
                                            </path>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button @click="closeDelete(idx)">close</button>
                        </form>
                    </dialog>

                    <!-- INVITE RSVP MODAL -->
                    <div v-if="ev.attributes.eventStatus !== 'going' || myId !== ev.attributes.event.data?.attributes?.initiator?.data?.id"
                        class="ml-auto shake con-hint event-card">
                        <div class="hint" :class="rsvpHint(ev.attributes.eventStatus, true)">
                            <p>{{ rsvpHint(ev.attributes.eventStatus, false) }}</p>
                        </div>
                        <svg v-if="!rsvpModal" class="w-4 hover:cursor-pointer"
                            :class="(ev.attributes.eventStatus === 'going') ? 'fill-success' : (ev.attributes.eventStatus === 'maybe') ? 'fill-accent' : (ev.attributes.eventStatus === 'noGo') ? 'fill-error' : 'fill-base-content/75 hover:fill-info'"
                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" @click="openRsvp(idx)">
                            <path
                                d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z">
                            </path>
                        </svg>
                        <svg v-if="rsvpModal" class="w-4 fill-info/75" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256">
                            <path
                                d="M230.66,86l-96-64a12,12,0,0,0-13.32,0l-96,64A12,12,0,0,0,20,96V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V96A12,12,0,0,0,230.66,86ZM128,46.42l74.86,49.91L141.61,140H114.39L53.14,96.33ZM44,196V119.29l59.58,42.48a12,12,0,0,0,7,2.23h34.9a12,12,0,0,0,7-2.23L212,119.29V196Z">
                            </path>
                        </svg>
                    </div>
                    <dialog ref="popRsvp" class="modal">
                        <div :class="formBg" method="dialog" class="modal-box w-auto max-fit px-9 pt-6 pb-0 shadow-none">
                            <h3 className="text-neutral-content font-medium text-md absolute left-3.5 top-3">RSVP</h3>
                            <button
                                class="btn btn-xs btn-circle btn-ghost focus:outline-none absolute right-2 top-2 opacity-75 hover:opacity-100 text-neutral-content/75"
                                @click="closeRsvp(idx)"><span class="">✕</span></button>
                            <h1 class="text-primary text-2xl text-center pt-6">
                                {{ ev.attributes.event.data?.attributes?.title }}
                            </h1>
                            <div
                                class="grid justify-center items-center w-full pb-7 text-neutral-content/75 text-center text-xs font-medium">
                                <span>Hosted by {{
                                    ev.attributes.event.data?.attributes?.initiator?.data?.attributes?.username }}</span>
                                <span>{{ shortDate(ev.attributes.event.data?.attributes?.startDate) }}</span>
                            </div>

                            <div class="grid grid-cols-5 w-full text-neutral-content/75 pb-6">

                                <div class="col-start-1 hover:cursor-pointer w-full group hover:text-primary"
                                    :class="(ev.attributes.eventStatus === 'going') ? 'text-primary font-semibold' : ''"
                                    @click="rsvpEvent(idx, ev.id, 'going')">
                                    <div class="flex justify-center row-start-1">
                                        <svg class="w-5 pb-[0.2rem] "
                                            :class="(ev.attributes.eventStatus === 'going') ? 'fill-primary' : 'fill-neutral-content/75 group-hover:fill-primary group-hover:animate-bounce'"
                                            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                            <path
                                                d="M234.49,111.07,90.41,22.94A20,20,0,0,0,60,39.87V216.13a20,20,0,0,0,30.41,16.93l144.08-88.13a19.82,19.82,0,0,0,0-33.86ZM84,208.85V47.15L216.16,128Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="flex justify-center">
                                        <span>Going</span>
                                    </div>
                                </div>

                                <div class="col-start-3 hover:cursor-pointer w-full group hover:text-warning"
                                    :class="(ev.attributes.eventStatus === 'maybe') ? 'text-warning font-semibold' : ''"
                                    @click="rsvpEvent(idx, ev.id, 'maybe')">
                                    <div class="flex justify-center row-start-1">
                                        <svg :class="(ev.attributes.eventStatus === 'maybe') ? 'fill-warning' : 'fill-neutral-content/75 group-hover:fill-warning group-hover:animate-bounce'"
                                            class="w-5 pb-[0.2rem]" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M128,20A108,108,0,1,0,236,128,108.12,108.12,0,0,0,128,20Zm0,192a84,84,0,1,1,84-84A84.09,84.09,0,0,1,128,212Zm52-52a12,12,0,0,1-12,12H88a12,12,0,0,1,0-24h80A12,12,0,0,1,180,160ZM76,108a16,16,0,1,1,16,16A16,16,0,0,1,76,108Zm104,0a16,16,0,1,1-16-16A16,16,0,0,1,180,108Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="flex justify-center">
                                        <span>Maybe</span>
                                    </div>
                                </div>

                                <div class="col-start-5 hover:cursor-pointer w-full group hover:text-error"
                                    :class="(ev.attributes.eventStatus === 'noGo') ? 'text-error font-semibold' : ''"
                                    @click="rsvpEvent(idx, ev.id, 'noGo')">
                                    <div class="flex justify-center row-start-1">
                                        <svg :class="(ev.attributes.eventStatus === 'noGo') ? 'fill-error' : 'fill-neutral-content/75 group-hover:fill-error group-hover:animate-bounce'"
                                            class="w-5 pb-[0.2rem]" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 256 256">
                                            <path
                                                d="M188,84a32,32,0,0,0-8,1V60a32,32,0,0,0-43.21-30A32,32,0,0,0,76,44v1A32,32,0,0,0,36,76v76a92,92,0,0,0,184,0V116A32,32,0,0,0,188,84Zm8,68a68,68,0,0,1-136,0V76a8,8,0,0,1,16,0v44a12,12,0,0,0,24,0V44a8,8,0,0,1,16,0v68a12,12,0,0,0,24,0V60a8,8,0,0,1,16,0v65.4A52.09,52.09,0,0,0,116,176a12,12,0,0,0,24,0,28,28,0,0,1,28-28,12,12,0,0,0,12-12V116a8,8,0,0,1,16,0Z">
                                            </path>
                                        </svg>
                                    </div>
                                    <div class="flex justify-center">
                                        <span>Flake</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button @click="closeRsvp(idx)">close</button>
                        </form>
                    </dialog>

                </div>
            </div>

    </div>
</div>
</template>
