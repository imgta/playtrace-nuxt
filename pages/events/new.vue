<script setup lang="ts">
const { toast } = useMisc();
const client = useStrapiClient();
const { url: appHost } = useRuntimeConfig().public.strapi;
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;

const eventBtnClass = ref('');
const showModal = ref(false);
const createEventAPI = ref<boolean>(false);
const createInviteAPI = ref<boolean>(false);

const autoResult: any = ref(null);
const locationAddress = ref('');

const partyCap: any = ref(null);
const coverDmg: any = ref(null);
const eventData = reactive({
    title: '',
    startDate: '',
    location: [],
    size: '',
    coverCharge: '',
    info: '',
    img: '',
    userInvites: [],
}) as any;
const userSearch = ref('');
const user = useStrapiUser().value;
const myUsername = user?.username;
const myId = (user?.id) as number;
console.log('user', user);

// ----------------------------------------------------------------
onMounted(() => {
    // @ts-expect-error idk
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        autoResult.value = place;
        locationInput();
    });
});
const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme === 'dracula' || 'night',
        'bg-slate-800/95 brightness-150': pageTheme === 'corporate' || 'fantasy',
    };
});
watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        eventBtnClass.value = 'before:rounded-none';
    } else {
        eventBtnClass.value = 'before:rounded-[100rem]';
    }
    console.log('eventData.userInvites', eventData.userInvites);
});

const inputValid = computed(() => {
    const username = userSearch.value.trim();
    const isValidInvite = eventData.userInvites.some((user: any) => user.Invite === username) || username === myUsername;

    return isValidInvite ? 'input input-bordered form-input' : 'input input-bordered form-input inputshake';
});
// ----------------------------------------------------------------
async function locationInput() {
    if (autoResult.value) {
        const locationData = autoResult.value;
        try {
            const address = await locationData.formatted_address.replace(', USA', '');

            // Filter out irrelevant/redundant types from the types array
            const categories = locationData.types.filter((type: string) => !['tourist_attraction', 'point_of_interest', 'establishment', 'meal_delivery', 'meal_takeaway', 'grocery_or_supermarket', 'health'].includes(type));

            // Join the categories into a single string
            const categoryStr = categories.join(', ');
            // Find last index of address_components (zipcode component)
            const zipcode = locationData.address_components[locationData.address_components.length - 1].long_name;
            console.log('zipcode', zipcode);
            const locationObj = {
                fullAddress: `${locationData.name} - ${address}`,
                address: address,
                venue: locationData.name,
                zipcode: zipcode,
                category: categoryStr,
            };
            eventData.location.push(locationObj);
            locationAddress.value = eventData.location[0].fullAddress;
        } catch (error) {
            console.error(error);
        }
    }
}

function chargeBlur() {
    if (coverDmg.value.includes('$')) {
        return `Cover charge: ${coverDmg.value}`;
    } else if (coverDmg.value) {
        const dmg = coverDmg.value;
        const floatVal = Number.parseFloat(dmg).toFixed(2);
        eventData.coverCharge = floatVal;
        coverDmg.value = `$${floatVal}`;
    } else if (!coverDmg.value) {
        const zeroDmg = '0';
        const zeroFloat = Number.parseFloat(zeroDmg).toFixed(2);
        eventData.coverCharge = zeroFloat;
        coverDmg.value = `$${zeroFloat}`;
    }
}

function partyBlur() {
    if (partyCap.value) {
        const cap = partyCap.value;
        eventData.size = cap;
        const capUnit = `${cap} spots`;
        partyCap.value = capUnit;
    }
}

async function startDateEmit(data: any) {
    eventData.startDate = data;
}
async function coverPicEmit(data: any) {
    const subString = '&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=70&w=600';
    const rawImg = data.replace(subString, '');
    eventData.img = rawImg;
}
async function coverModalEmit(data: any) {
    showModal.value = data;
}
async function toggleModal() {
    showModal.value = !showModal.value;
}

async function createEvent(e: Event) {
    e.preventDefault();
    try {
        if (!eventData.coverCharge) {
            const zeroDmg = '0';
            const zeroFloat = Number.parseFloat(zeroDmg).toFixed(2);
            eventData.coverCharge = zeroFloat;
            coverDmg.value = `$${zeroFloat}`;
        }
        if (!eventData.size) {
            eventData.size = 0;
            partyCap.value = 'Unlimited spots';
        }
        if (!eventData.title) {
            toast.error('Title required!', { timeout: 1500 });
            return;
        } else if (!eventData.startDate) {
            toast.error('Start Date required!', { timeout: 1500 });
            return;
        } else if (!eventData.img) {
            toast.error('Cover Picture required!', { timeout: 1500 });
            return;
        }
    } catch (error) {
        console.error(error);
    }
    try {
        createEventAPI.value = true;

        // (1) Create new event
        const formData = new FormData();
        const form = {
            initiator: user,
            title: eventData.title,
            startDate: eventData.startDate,
            location: eventData.location,
            partySize: eventData.size,
            coverCharge: eventData.coverCharge,
            info: eventData.info,
            categories: eventData.categories
        };
        // Fetch img URL, convert response to blob
        const imgRes = await (fetch(eventData.img));
        const imgBlob = await imgRes.blob();
        const imgName = `${eventData.title}_eventPic`;
        // Append event fields and image
        formData.append('data', JSON.stringify(form));
        formData.append('files.eventPic', imgBlob, imgName);
        const eventRes: Record<string, any> = await client(`${appHost}api/events`, {
            method: 'POST',
            body: formData,
        });
        const eventResult = await eventRes.data;
        console.log('eventResult', eventResult);

        // (2) Create an 'accepted' event invitation for event host (initiator)
        const hostInviteForm = new FormData();
        const hostInviteObj = {
            users_permissions_user: user,
            collection: 'event',
            event: eventResult,
            eventStatus: 'going',
        };
        hostInviteForm.append('data', JSON.stringify(hostInviteObj));
        const hostInviteRes: Record<string, any> = await client(`${appHost}api/invited-users`, {
            method: 'POST',
            body: hostInviteForm,
        });
        const hostInviteData = await hostInviteRes.data;
        console.log('hostInviteData', hostInviteData);
        createEventAPI.value = false;

        // (3) Create 'invited' event invitation for each user in userInvites array
        createInvites(await eventResult);
    } catch (error: any) {
        console.error(error);
    } finally {
        toast.success('New event created!', { timeout: 1500 });
        navigateTo('/events');
    }
}

async function createInvites(eventRes: any) {
    for (const user of eventData.userInvites) {
        const inviteForm = new FormData();
        const inviteObj = {
            users_permissions_user: user,
            collection: 'event',
            event: eventRes,
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
            createInviteAPI.value = false;
        }
    }
}

async function inviteUser() {
    try {
        const username = userSearch.value.trim();

        // Check if user has already been added to userInvites array
        // Note: invitation for initiator (host) will already be created on event creation
        if (eventData.userInvites.some((user: any) => user.username === username) || username === myUsername) {
            toast.info('User is already on the invite list!', { timeout: 1700 });
            userSearch.value = '';
            return;
        }

        // Check if username exists in database
        const userRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$eq]=${username}`, {
            method: 'GET'
        });
        const user = userRes[0];
        if (userRes && user) {
            eventData.userInvites.push(user);
            userSearch.value = '';
        } else {
            console.log('User not found!');
            toast.error('User not found!', { timeout: 1700 });
            userSearch.value = '';
        }
    } catch (error) {
        console.error(error);
    }
}

function removeUser(index: any) {
    eventData.userInvites.splice(index, 1);
    console.log(eventData.userInvites);
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="max-h-full max-w-full">
        <div class="flex items-center justify-center content-center bg-base-200">
            <h1 class="text-primary text-4xl text-center pt-8">
                New Event!
            </h1>
        </div>
        <div>
            <p class="text-base-content/90 text-center text-sm">
                Two's a party, three's a crowd.
            </p>
        </div>
    </div>

    <div class="bg-base-200">
        <div class="flex w-full shadow-none justify-center">
            <div class="flex flex-col-reverse lg:flex-row w-full justify-center sm:px-20">
                <div class="sm:w-auto min-w-[10%] lg:min-w-[42%]">
                    <div class="card-body pb-1.5">

                        <div class="w-full con-hint top pb-2">
                            <div class="hint">
                                <p>Event Title</p>
                            </div>
                            <input v-model="eventData.title" placeholder="Untitled Event" name="title" type="text"
                                class="input input-bordered form-input" />
                        </div>

                        <div class="w-full con-hint left">
                            <div class="hint">
                                <p>Location</p>
                            </div>
                            <input id="autocomplete" v-model="locationAddress" name="location" type="text"
                                placeholder="Where at?" class="input input-bordered form-input" />
                        </div>

                        <div class="w-full con-hint left py-0">
                            <div class="hint">
                                <p>Start Date</p>
                            </div>
                            <div class="">
                                <VPicker @startDateInput="startDateEmit" />
                            </div>
                        </div>

                        <div class="w-full con-hint left pb-2">
                            <div class="hint">
                                <p>Party Size</p>
                            </div>
                            <input v-model="partyCap" placeholder="Unlimited" name="capacity" type="text"
                                class="input input-bordered form-input" @blur="partyBlur" />
                        </div>

                        <div class="w-full con-hint left pb-2">
                            <div class="hint">
                                <p>Damage</p>
                            </div>
                            <input id="cover" v-model="coverDmg" placeholder="Cover charge" name="cover" type="text"
                                class="input input-bordered form-input" @blur="chargeBlur" />
                        </div>

                        <div class="con-hint left w-full">
                            <div class="hint">
                                <p>The Deets</p>
                            </div>
                            <textarea v-model="eventData.info" placeholder="Whose birthday is it this time?" type="text"
                                name="description"
                                class="textarea text-bordered textarea-sm textarea-neutral form-input h-20 lg:max-w-[100%] sm:max-w-[100%] resize leading-normal" />
                        </div>

                    </div>
                </div>

                <div class="w-full h-full pt-8 lg:pl-0 sm:px-8 max-sm:px-8">

                    <div class="justify-center content-center self-center items-center max-h-full">

                        <div @click="toggleModal">
                            <button v-if="!showModal && !eventData.img"
                                class="edit edit-primary min-w-[100%] lg:min-w-[80%] h-full lg:h-[90%]">
                                Cover Picture</button>
                            <img v-if="!showModal && eventData.img" :src="eventData.img" alt="Cover"
                                class="edit edit-primary object-cover h-[19rem] w-[100%] lg:w-[80%]" />
                        </div>

                        <div v-if="showModal">
                            <dialog class="modal" :class="{ 'modal-open': showModal }">
                                <div method="dialog" class="modal-box max-w-4xl">
                                    <CoverPicSelect @coverPicInput="coverPicEmit" @modalState="coverModalEmit" />
                                </div>
                                <form method="dialog" class="modal-backdrop" @click="toggleModal">
                                    <button>close</button>
                                </form>
                            </dialog>
                        </div>

                        <div
                            class="min-w-[100%] lg:min-w-[80%] h-full lg:h-[90%] con-hint right pt-4">
                            <div class="hint lg:pt-3">
                                <p>Invite Friends</p>
                            </div>
                            <input v-model="userSearch" placeholder="Invite by username" name="title" type="text"
                                :class="inputValid" @keyup.enter="inviteUser" />
                        </div>

                        <div v-if="eventData.userInvites.length > 0" class="pt-2">
                            <span class="text-sm font-medium">Invites:</span>
                            <div v-for="(user, index) in eventData.userInvites" :key="index"
                                class="inline-block whitespace-nowrap pl-1">
                                <span class="badge badge-lg gap-1 text-xs text-primary/90 font-medium pl-3 pr-2">
                                    {{ user.username }}
                                    <span
                                        class="badge badge-xs px-1 bg-transparent cursor-pointer hover:opacity-100 hover:font-semibold hover:badge-error border-0"
                                        @click="removeUser(index)">x</span>
                                    </span>
                            </div>
                        </div>

                    </div>

                    <div
                        class="absolute top-32 sm:top-60 lg:right-36 md:right-32 sm:right-32 max-sm:-translate-x-full max-sm:left-14 pointer-events-none z-0">
                        <Bubbles />
                    </div>

                </div>
            </div>
        </div>

        <div class="sm:px-24 sm:pb-10 lg:pl-0">

            <div class="flex items-center justify-center place-content-center">
                <button v-if="!createEventAPI && !createInviteAPI" class="event-create" :class="eventBtnClass" type="submit" @click="createEvent">
                    <span>Create</span>
                    <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </div>

            <div class="flex justify-center items-center pt-2">
                <span v-if="createEventAPI" class="px-3 duration-75 ease-in-out animate-pulse font-medium">Creating</span>
                <span v-if="createInviteAPI" class="px-3 duration-75 ease-in-out animate-pulse font-medium">Inviting</span>
                <Loader v-if="createEventAPI || createInviteAPI" />
            </div>

        </div>

    </div>
</template>
