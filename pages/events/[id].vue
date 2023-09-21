<script setup lang="ts">
import { shortDate } from '~/utils/misc';

definePageMeta({
    middleware: ['auth'],
});

const client = useStrapiClient();
const { toast } = useMisc();
const appHost = useRuntimeConfig().public.strapi.url;
const eventId = Number(useRoute().params.id);
const { id: userId, username: userUsername } = useStrapiUser().value as any;

const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;

const userRsvp = ref();
const inviteId = ref();
const eventObj = ref();

const eventData = reactive({
    creatorId: '',
    creatorUser: '',
    title: '',
    startDate: '',
    partySize: '',
    coverCharge: '',
    info: '',
    eventPic: '',
    location: [],
    categories: [],
    eventInvites: [],
    userInvites: [],
    newInvites: [],
    receipts: [],
    spots: '',
}) as any;

const popDelete = ref<any | null>(null);
const popRsvp = ref<any | null>(null);
const rsvpModal = ref(false);

const userSearch = ref('');
const eventBtnClass = ref('');
const createInviteAPI = ref<boolean>(false);

const inputClass = ref('w-[10rem]');
const isLoading = ref<boolean>(true);
// ----------------------------------------------------------------
onMounted(() => {
    getEvent(eventId);
    getInvite(eventId, userId);
});
watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        eventBtnClass.value = 'before:rounded-none';
    } else {
        eventBtnClass.value = 'before:rounded-[100rem]';
    }
    console.log('userInvites', eventData.userInvites);
});
const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-slate-800/95 brightness-125': pageTheme === 'corporate' || 'fantasy',
    };
});
const inputValid = computed(() => {
    if (eventData.newInvites.length < 1) {
        inputClass.value = 'w-[10rem]';
    }
    const username = userSearch.value.trim();
    (eventData.userInvites.some((user: any) => user.username === username)) ? inputClass.value += ' inputshake' : (eventData.newInvites.length > 0) ? inputClass.value += ' w-[23.5rem]' : inputClass.value += ' ';
    ;
    return inputClass.value;
});
// ----------------------------------------------------------------
async function getEvent(eventId: number) {
    isLoading.value = true;
    try {
        const eventRes: Record<string, any> = await client(`${appHost}api/events/${eventId}?populate[0]=initiator.avatar&populate[1]=initiator.wallets&populate[2]=eventPic&populate[3]=location&populate[4]=eventReceipt.receiptItem&populate[5]=invited_users.users_permissions_user`, {
            method: 'GET'
        });
        const {
            title, startDate, partySize, coverCharge, info, location, eventReceipt,
            eventPic: { data: { attributes: { url: eventPic } } },
            initiator: { data: { id: initiatorId } },
            initiator: { data: { attributes: { username: initiatorUser } } },
            invited_users: { data: invites },
        } = await eventRes.data.attributes;

        eventData.creatorId = await initiatorId;
        eventData.creatorUser = await initiatorUser;
        eventData.title = await title;
        eventData.startDate = await startDate;
        eventData.partySize = await partySize;
        eventData.coverCharge = await coverCharge;
        eventData.info = await info;
        eventData.eventPic = await eventPic;
        eventData.location = await location;
        eventData.eventInvites = await invites;
        eventData.receipts.value = await eventReceipt;

        eventData.categories.push(eventData.location[0]?.category.split(', '));

        // Calculate remaining open spots for event
        // Push all invited usernames from eventInvites to userInvites array
        let going = 0;
        eventData.eventInvites.forEach(async (invite: Record<string, any>) => {
            if (invite.attributes.eventStatus === 'going') {
                going++;
            }
            const invitedUser = invite.attributes.users_permissions_user.data.attributes.username;
            (eventData.userInvites).push({ 'username': invitedUser });
        });
        eventData.spots = eventData.partySize - going;

        console.log('eventData.userInvites', eventData.userInvites);
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

async function getInvite(eventId: number, userId: number) {
    isLoading.value = true;
    try {
        const inviteRes: Record<string, any> = await client(`${appHost}api/invited-users?populate=*&filters[$and][0][collection][$eq]=event&filters[$and][1][users_permissions_user][id][$eq]=${userId}&filters[$and][2][event][id][$eq]=${eventId}`);
        const {
            id,
            attributes: { eventStatus },
            attributes: { event },
        } = await inviteRes.data[0];

        userRsvp.value = eventStatus;
        inviteId.value = id;
        eventObj.value = event.data;
    } catch (error) {
        console.error(error);
    } finally {
        isLoading.value = false;
    }
}

async function rsvpEvent(eventId: number, inviteId: number, rsvp: string) {
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
        closeRsvp();
    } catch (error) {
        console.error(error);
    } finally {
        if (rsvp === 'going') {
            toast.info('RSVP: Going!', { timeout: 1500 });
        } else if (rsvp === 'maybe') {
            toast.warning('RSVP: Maybe?', { timeout: 1500 });
        } else if (rsvp === 'noGo') {
            toast.error('RSVP: Not going.', { timeout: 1500 });
        }
        await getInvite(eventId, userId);
    }
};

// TODO: add intermediary loader during delete cascade
async function deleteEvent(eventId: number) {
    try {
        closeDelete();
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
            toast.info('All event invites deleted!', { timeout: 1500 });
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
        getInvite(eventId, userId);
        await navigateTo('/events');
    }
}

function openDelete() {
    popDelete.value.showModal();
}
function closeDelete() {
    popDelete.value.close();
}
function openRsvp() {
    popRsvp.value.showModal();
    rsvpModal.value = true;
}
function closeRsvp() {
    popRsvp.value.close();
    rsvpModal.value = false;
}

async function createInvites(eventObj: Record<string, any>) {
    try {
        createInviteAPI.value = true;
        for (const inviteUser of eventData.newInvites) {
            const inviteForm = new FormData();
            const inviteObj = {
                users_permissions_user: inviteUser,
                collection: 'event',
                event: eventObj,
                eventStatus: 'invited',
            };
            inviteForm.append('data', JSON.stringify(inviteObj));

            try {
                createInviteAPI.value = true;
                const inviteRes: Record<string, any> = await client(`${appHost}api/invited-users`, {
                    method: 'POST',
                    body: inviteForm,
                });
                const inviteData = await inviteRes.data;
                console.log('inviteData', inviteData);
            } catch (error) {
                console.error(error);
            } finally {
                toast.info(`${inviteUser.username} invited!`, { timeout: 1200 });
                removeInvite(inviteUser);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        createInviteAPI.value = false;
    }
}

async function inviteUser() {
    try {
        const username = userSearch.value.trim();
        // Check if user has already been added to userInvites array
        // Note: invitation for initiator (host) will already be created on event creation
        if (eventData.userInvites.some((user: any) => user.username === username)) {
            toast.info('User is already on the invite list!', { timeout: 1700 });
            userSearch.value = '';
            return;
        }
        // Check if username exists in database
        const userRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$eq]=${username}`, {
            method: 'GET'
        });
        console.log('userRes', userRes);
        const inputUser = userRes[0];
        if (userRes && inputUser) {
            try {
                eventData.userInvites.push({ 'username': inputUser.username });
                eventData.newInvites.push(inputUser);
                userSearch.value = '';
            } catch (error) {
                console.error(error);
            }
        } else {
            toast.error('User not found!', { timeout: 1700 });
            userSearch.value = '';
        }
    } catch (error) {
        console.error(error);
    } finally {
        console.log('newInvites', eventData.newInvites);
    }
}

function removeInvite(index: any) {
    eventData.newInvites.splice(index, 1);
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="px-10 pt-5 md:px-10">
        <div class="max-w-[50rem] mx-auto bg-base-100 md:max-h-[27.75rem] md:max-w-[60rem]">
            <div class="md:flex">

                <!-- COVER PIC -->
                <div class="md:shrink md:p-1.5">
                    <Loader v-if="isLoading" class="my-[9rem] mx-[13rem] md:my-[13.5rem] md:mx-[15.5rem]" />
                    <img class="h-80 w-full object-cover md:max-h-[27rem] md:max-w-full md:w-[33rem] md:h-[27rem]"
                        :class="isLoading ? 'hidden' : ''"
                        :src="eventData.eventPic">
                </div>

                <!-- CARD -->
                <div class="md:grow pl-5 pr-3 py-2.5">

                    <!-- TOP RIGHT MODALS -->
                    <div class="flex justify-end pt-0.5 pb-4">
                        <!-- INVITE RSVP MODAL -->
                        <div v-if="userId !== eventData.creatorId" class="self-end shake">
                            <svg v-if="!rsvpModal" class="w-4 hover:cursor-pointer"
                                :class="(userRsvp === 'going') ? 'fill-info' : (userRsvp === 'maybe') ? 'fill-accent' : (userRsvp === 'noGo') ? 'fill-error' : 'fill-base-content/75 hover:fill-info'"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" @click="openRsvp()">
                                <path
                                    d="M224,44H32A12,12,0,0,0,20,56V192a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V56A12,12,0,0,0,224,44ZM193.15,68,128,127.72,62.85,68ZM44,188V83.28l75.89,69.57a12,12,0,0,0,16.22,0L212,83.28V188Z">
                                </path>
                            </svg>
                            <svg v-if="rsvpModal" class="w-4"
                                :class="(userRsvp === 'going') ? 'fill-info' : (userRsvp === 'maybe') ? 'fill-accent' : (userRsvp === 'noGo') ? 'fill-error' : 'fill-info/75'"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <path
                                    d="M230.66,86l-96-64a12,12,0,0,0-13.32,0l-96,64A12,12,0,0,0,20,96V200a20,20,0,0,0,20,20H216a20,20,0,0,0,20-20V96A12,12,0,0,0,230.66,86ZM128,46.42l74.86,49.91L141.61,140H114.39L53.14,96.33ZM44,196V119.29l59.58,42.48a12,12,0,0,0,7,2.23h34.9a12,12,0,0,0,7-2.23L212,119.29V196Z">
                                </path>
                            </svg>
                        </div>
                        <dialog ref="popRsvp" class="modal">
                            <div :class="formBg" method="dialog"
                                class="modal-box w-auto max-fit px-9 pt-6shadow-none">
                                <h3 className="text-neutral-content font-medium text-sm absolute left-3.5 top-3">
                                    RSVP</h3>
                                <button
                                    class="btn btn-xs btn-circle btn-ghost focus:outline-none absolute right-2 top-2 opacity-75 hover:opacity-100 text-neutral-content/75"
                                    @click="closeRsvp()"><span class="">✕</span></button>
                                <h1 class="text-primary text-2xl text-center pt-6">
                                    {{ eventData.title }}
                                </h1>
                                <div
                                    class="grid justify-center items-center w-full pb-7 text-neutral-content/75 text-center text-xs font-medium">
                                    <span>Hosted by {{
                                        eventData.initiatorUser
                                    }}</span>
                                    <span>{{ shortDate(eventData.startDate) }}</span>
                                </div>

                                <div class="grid grid-cols-5 w-full text-neutral-content/75 pb-6">

                                    <div class="col-start-1 hover:cursor-pointer w-full group hover:text-primary"
                                        :class="(userRsvp === 'going') ? 'text-primary font-semibold' : ''"
                                        @click="rsvpEvent(eventId, inviteId, 'going')">
                                        <div class="flex justify-center row-start-1">
                                            <svg class="w-5 pb-[0.2rem] "
                                                :class="(userRsvp === 'going') ? 'fill-primary' : 'fill-neutral-content/75 group-hover:fill-primary group-hover:animate-bounce'"
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
                                        :class="(userRsvp === 'maybe') ? 'text-warning font-semibold' : ''"
                                        @click="rsvpEvent(eventId, inviteId, 'maybe')">
                                        <div class="flex justify-center row-start-1">
                                            <svg :class="(userRsvp === 'maybe') ? 'fill-warning' : 'fill-neutral-content/75 group-hover:fill-warning group-hover:animate-bounce'"
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
                                        :class="(userRsvp === 'noGo') ? 'text-error font-semibold' : ''"
                                        @click="rsvpEvent(eventId, inviteId, 'noGo')">
                                        <div class="flex justify-center row-start-1">
                                            <svg :class="(userRsvp === 'noGo') ? 'fill-error' : 'fill-neutral-content/75 group-hover:fill-error group-hover:animate-bounce'"
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
                                <button @click="closeRsvp()">close</button>
                            </form>
                        </dialog>

                        <!-- DELETE EVENT MODAL -->
                        <div v-if="userId === eventData.creatorId" class="con-hint event-card" @click="openDelete()">
                            <svg class="w-3.5 fill-base-content/75 hover:fill-error hover:cursor-pointer"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                <path
                                    d="M208.49,191.51a12,12,0,0,1-17,17L128,145,64.49,208.49a12,12,0,0,1-17-17L111,128,47.51,64.49a12,12,0,0,1,17-17L128,111l63.51-63.52a12,12,0,0,1,17,17L145,128Z">
                                </path>
                            </svg>
                        </div>
                        <dialog ref="popDelete" class="modal">
                            <div :class="formBg" method="dialog"
                                class="modal-box w-auto max-fit px-8 py-3 pb-8 shadow-none">
                                <h3 className="text-neutral-content font-medium text-sm absolute left-3.5 top-3">
                                    DELETE</h3>
                                <button
                                    class="btn btn-xs btn-circle btn-ghost focus:outline-none absolute right-2 top-2 opacity-75 hover:opacity-100 text-neutral-content/75"
                                    @click="closeDelete()"><span class="">✕</span></button>
                                <h1 class="text-primary text-2xl text-center pt-9 pb-0 px-6">
                                    {{ eventData.title }}
                                </h1>
                                <div class="flex justify-center items-center w-full pb-4">
                                    <span class="text-neutral-content/80 text-center text-xs font-normal">Delete
                                        event?</span>
                                </div>

                                <div class="grid grid-cols-2 justify-center items-center w-full text-neutral-content/75">

                                    <div class="col-start-1 hover:cursor-pointer w-full group"
                                        @click="deleteEvent(eventId)">
                                        <div class="flex justify-center group-hover:text-primary group-hover:font-semibold px-4">
                                            <span class="pr-1">Yes</span>
                                            <svg class="fill-neutral-content/75 w-4 pb-[0.2rem] group-hover:fill-primary group-hover:animate-bounce inline"
                                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                                                <path
                                                    d="M232.49,80.49l-128,128a12,12,0,0,1-17,0l-56-56a12,12,0,1,1,17-17L96,183,215.51,63.51a12,12,0,0,1,17,17Z">
                                                </path>
                                            </svg>
                                        </div>
                                    </div>

                                    <div class="col-start-2 hover:cursor-pointer w-full group" @click="closeDelete()">
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
                                <button @click="closeDelete()">close</button>
                            </form>
                        </dialog>
                    </div>

                    <!-- CARD HEADER -->
                    <div class="pb-2">
                        <div v-if="isLoading">
                            <div class="flex justify-center text-center tracking-wide text-xl md:text-2xl lg:text-3xl text-primary font-semibold blur-md animate-pulse">Event Title</div>
                            <div class="flex justify-center font-medium text-xs lg:text-sm text-base-content/80 blur-md animate-pulse">Next Sun • 12:45AM</div>
                        </div>
                        <div :class="isLoading ? 'hidden' : ''" class="flex justify-center text-center tracking-wide text-xl md:text-2xl lg:text-3xl text-primary font-semibold">{{ eventData.title }}</div>
                        <div :class="isLoading ? 'hidden' : ''" class="flex justify-center font-medium text-xs lg:text-sm text-base-content/80">{{ shortDate(eventData.startDate) }}</div>
                    </div>

                    <!-- EVENT INFO -->
                    <div class="self-start text-sm lg:text-base font-medium text-base-content/75">

                        <!-- HOSTS -->
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 md:w-[1.2rem]"
                                :class="userId === eventData.creatorId ? 'fill-accent-focus/90' : 'fill-base-content/75'"
                                viewBox="0 0 256 256">
                                <path
                                    d="M246.46,73.17a16,16,0,0,0-17.74-2.26l-46.9,23.38-40-66.49a16.11,16.11,0,0,0-27.6,0l-40,66.49L27.31,70.92A16.1,16.1,0,0,0,4.82,90.35l37,113.35a12,12,0,0,0,17.51,6.61C59.57,210.17,84.39,196,128,196s68.43,14.19,68.62,14.3a12,12,0,0,0,17.57-6.58l37-113.29A16,16,0,0,0,246.46,73.17ZM195.53,183.52C182.18,178.4,159.2,172,128,172s-54.18,6.42-67.53,11.54l-27-82.71L70,119a16.18,16.18,0,0,0,21-6.11l37-61.49,37,61.5a16.18,16.18,0,0,0,21,6.1l36.52-18.2Zm-19.67-31A12,12,0,0,1,164,162.69a12.91,12.91,0,0,1-1.85-.14,229.32,229.32,0,0,0-68.34,0,12,12,0,0,1-3.66-23.72,253.38,253.38,0,0,1,75.66,0A12,12,0,0,1,175.86,152.52Z">
                                </path>
                            </svg>
                            <span v-if="isLoading" class="inline pl-2 blur-sm animate-pulse pt-2">Someone you know?</span>
                            <span :class="isLoading ? 'hidden' : ''" class="inline pl-2">{{ eventData.creatorUser }}</span>
                        </div>

                        <!-- ADDRESS -->
                        <div class="flex shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 md:w-[1.2rem] fill-base-content/75"
                                viewBox="0 0 256 256">
                                <path
                                    d="M128,60a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,60Zm0,64a20,20,0,1,1,20-20A20,20,0,0,1,128,124Zm0-112a92.1,92.1,0,0,0-92,92c0,77.36,81.64,135.4,85.12,137.83a12,12,0,0,0,13.76,0,259,259,0,0,0,42.18-39C205.15,170.57,220,136.37,220,104A92.1,92.1,0,0,0,128,12Zm31.3,174.71A249.35,249.35,0,0,1,128,216.89a249.35,249.35,0,0,1-31.3-30.18C80,167.37,60,137.31,60,104a68,68,0,0,1,136,0C196,137.31,176,167.37,159.3,186.71Z">
                                </path>
                            </svg>
                            <div v-if="isLoading" class="inline pl-2 blur-sm animate-pulse">
                                <span>RSVP to reveal.</span>

                            </div>
                            <div class="inline pl-2" :class="isLoading ? 'hidden' : ''">
                                <span v-if="userRsvp !== 'going'">RSVP to reveal.</span>
                                <span v-else-if="eventData.location[0]?.address && userRsvp === 'going'" class="">
                                    {{ eventData.location[0]?.address }}</span>
                                <span v-else-if="!eventData.location[0]?.address && userRsvp === 'going'">TBD.</span>
                            </div>
                        </div>

                        <!-- COVER CHARGE -->
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-[0.95rem] md:w-[1.1rem] fill-base-content/75 rotate-[24deg]"
                                viewBox="0 0 256 256">
                                <path
                                    d="M228,108.4a20,20,0,0,0,16-19.59V64a20,20,0,0,0-20-20H32A20,20,0,0,0,12,64V88.81A20,20,0,0,0,28,108.4a20,20,0,0,1,0,39.2,20,20,0,0,0-16,19.59V192a20,20,0,0,0,20,20H224a20,20,0,0,0,20-20V167.19a20,20,0,0,0-16-19.59,20,20,0,0,1,0-39.2ZM36,170.34a44,44,0,0,0,0-84.68V68H84V188H36Zm184,0V188H108V68H220V85.66a44,44,0,0,0,0,84.68Z">
                                </path>
                            </svg>
                            <span v-if="isLoading" class="inline pl-2 blur-sm animate-pulse">Free.99</span>
                            <div :class="isLoading ? 'hidden' : ''">
                                <span v-if="eventData.coverCharge" class="inline pl-2">${{ eventData.coverCharge }} cover</span>
                                <span v-else class="inline pl-2">Free</span>
                            </div>
                        </div>

                        <!-- PARTY SIZE -->
                        <div class="flex">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 md:w-[1.2rem] fill-base-content/75"
                                viewBox="0 0 256 256">
                                <path
                                    d="M164.38,181.1a52,52,0,1,0-72.76,0,75.89,75.89,0,0,0-30,28.89,12,12,0,0,0,20.78,12,53,53,0,0,1,91.22,0,12,12,0,1,0,20.78-12A75.89,75.89,0,0,0,164.38,181.1ZM100,144a28,28,0,1,1,28,28A28,28,0,0,1,100,144Zm147.21,9.59a12,12,0,0,1-16.81-2.39c-8.33-11.09-19.85-19.59-29.33-21.64a12,12,0,0,1-1.82-22.91,20,20,0,1,0-24.78-28.3,12,12,0,1,1-21-11.6,44,44,0,1,1,73.28,48.35,92.18,92.18,0,0,1,22.85,21.69A12,12,0,0,1,247.21,153.59Zm-192.28-24c-9.48,2.05-21,10.55-29.33,21.65A12,12,0,0,1,6.41,136.79,92.37,92.37,0,0,1,29.26,115.1a44,44,0,1,1,73.28-48.35,12,12,0,1,1-21,11.6,20,20,0,1,0-24.78,28.3,12,12,0,0,1-1.82,22.91Z">
                                </path>
                            </svg>
                            <div v-if="isLoading" class="inline pl-2 blur-sm animate-pulse">open</div>
                            <div class="inline pl-2" :class="isLoading ? 'hidden' : ''">
                                <span v-if="eventData.partySize"><span class="text-primary/80">{{ eventData.spots }}</span>/{{
                                    eventData.partySize }}
                                    spots left!</span>
                                <span v-else-if="!eventData.partySize">open</span>
                                <span v-else-if="!eventData.spots" class="text-base-content/50"><s>{{ eventData.spots }}/{{
                                    eventData.partySize }} full </s></span>
                            </div>
                        </div>

                        <!-- TAGS/CATEGORIES -->
                        <div v-if="isLoading">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-[1.05rem] md:w-[1.25rem] fill-base-content/75 -rotate-45"
                                viewBox="0 0 256 256">
                                <path
                                    d="M246.15,133.18,146.83,33.86A19.85,19.85,0,0,0,132.69,28H40A12,12,0,0,0,28,40v92.69a19.85,19.85,0,0,0,5.86,14.14l99.32,99.32a20,20,0,0,0,28.28,0l84.69-84.69A20,20,0,0,0,246.15,133.18Zm-98.83,93.17L52,131V52h79l95.32,95.32ZM100,84A16,16,0,1,1,84,68,16,16,0,0,1,100,84Z">
                                </path>
                            </svg>
                            <div class="inline pl-[0.2rem]">
                                <div
                                    class="inline pl-1">
                                    <span
                                        class="badge badge-outline badge-sm text-[11px] font-semibold text-center align-middle opacity-90 px-1 py-1 blur-sm animate-pulse">
                                        this_is_a_tag
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div v-if="eventData.location[0]?.category" :class="isLoading ? 'hidden' : ''">
                            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-[1.05rem] md:w-[1.25rem] fill-base-content/75 -rotate-45"
                                viewBox="0 0 256 256">
                                <path
                                    d="M246.15,133.18,146.83,33.86A19.85,19.85,0,0,0,132.69,28H40A12,12,0,0,0,28,40v92.69a19.85,19.85,0,0,0,5.86,14.14l99.32,99.32a20,20,0,0,0,28.28,0l84.69-84.69A20,20,0,0,0,246.15,133.18Zm-98.83,93.17L52,131V52h79l95.32,95.32ZM100,84A16,16,0,1,1,84,68,16,16,0,0,1,100,84Z">
                                </path>
                            </svg>
                            <div class="inline pl-[0.2rem]">
                                <div v-for="tag in eventData.categories[0]" :key="tag"
                                    class="inline pl-1">
                                    <span
                                        class="badge badge-outline badge-sm text-[11px] font-semibold text-center align-middle opacity-90 px-1 py-1">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- EVENT DESCRIPTION -->
                        <p v-if="isLoading" class="text-xs md:text-sm text-base-content/75 py-5 pb-8 blur-sm animate-pulse">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim quia, fuga nostrum pariatur, sit nemo dicta odit deserunt consequuntur similique exercitationem, labore optio!</p>
                        <p :class="isLoading ? 'hidden' : ''" class="text-xs md:text-sm text-base-content/75 py-5 pb-8">{{ eventData.info }}</p>

                        <!-- INVITATIONS -->
                        <div v-if="userId === eventData.creatorId">
                            <div class="flex justify-center h-full pb-0.5">
                                <input v-model="userSearch" class="input input-bordered invite-search text-center h-10"
                                    placeholder="Send more invites" name="invites" type="text" :class="inputValid"
                                    @keyup.enter="inviteUser" />
                            </div>
                            <Loader v-if="createInviteAPI" />
                            <div v-if="eventData.newInvites.length > 0" class="flex justify-center align-top py-4 md:pt-4">
                                <div class="inline-flex justify-start py-1.5 pr-2 h-[2.2rem]">
                                    <button v-if="!createInviteAPI" class="invite max-h-[2.2rem]" :class="eventBtnClass"
                                        type="submit" @click="createInvites(eventObj)">
                                        <span>Invite</span>
                                        <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                                            <path d="M1,5 L11,5"></path>
                                            <polyline points="8 1 12 5 8 9"></polyline>
                                        </svg>
                                    </button>
                                </div>

                                <div v-for="(user, index) in eventData.newInvites" :key="index"
                                    class="inline-grid grid-cols-3 gap-0.5 pl-2">
                                    <span
                                        class="badge badge-md border-primary border-[1.75px] gap-1 text-xs text-primary font-semibold pl-2 pr-[0.05rem]">{{
                                            user.username }}
                                        <span
                                            class="badge badge-sm bg-transparent cursor-pointer hover:opacity-100 hover:font-bold hover:badge-error border-0"
                                            @click="removeInvite(index)"><span class="text-[10px]">✕</span></span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
