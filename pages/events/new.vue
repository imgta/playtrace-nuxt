<script setup lang="ts">
definePageMeta({
    middleware: ['auth'],
});

const { toast } = useMisc();
const { appHost, client } = useAuth();
const { eventData, userSearch, matchingUsers, selectInviteUser, removeInvite, myUsername, debouncedUserSearch } = useEvent();
const user = useStrapiUser().value;

const themeCookie = useCookie('selectedTheme');
const eventBtnClass = ref('');
const showModal = ref(false);

const createEventAPI = ref<boolean>(false);
const createInviteAPI = ref<boolean>(false);

const autoResult: any = ref(null);
const locationAddress = ref('');
const partyCap = ref<string>() as any;
const coverDmg = ref<string>() as any;

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

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        eventBtnClass.value = 'before:rounded-none';
    } else {
        eventBtnClass.value = 'before:rounded-[100rem]';
    }
});

const validInvite = computed(() => {
    const username = userSearch.value.trim();
    const isValidInvite = eventData.newInvites.some((user: any) => user.Invite === username) || username === myUsername;
    return isValidInvite ? 'input input-bordered form-input' : 'input input-bordered form-input inputshake';
});

// ----------------------------------------------------------------
async function locationInput() {
    if (autoResult.value) {
        const locationData = autoResult.value;
        try {
            const address = await locationData.formatted_address.replace(', USA', '');
            // Filter out and replace irrelevant/redundant types from the types array
            const typeFilter = ['tourist_attraction', 'point_of_interest', 'establishment', 'street_address', 'meal_delivery', 'meal_takeaway', 'health', 'premise'];

            const typeReplace = {
                'grocery_or_supermarket': 'grocery, food',
                'drugstore': 'drugstore',
                'convenience': 'convenience',
                'beauty_salon': 'beauty_salon',
                'clothing_store': 'clothing_store',
                'transit_station': 'transit',
                'place_of_worship': 'sanctuary',
                'natural_feature': 'nature',
            };

            // Create Set to track unique types and avoid duplicates
            const uniqueTags = new Set<string>(locationData.types
                .filter((type: string) => {
                    if (type === 'store' && locationData.types.some((tag: string) => tag !== type && tag.endsWith('_store'))) {
                        return false;
                    }
                    return !typeFilter.includes(type);
                })
                .map((type: string) => (locationData.types.includes('grocery_or_supermarket')) ? 'grocery, food' : (locationData.types.includes('drugstore')) ? 'drugstore' : (locationData.types.includes('convenience')) ? 'convenience' : (locationData.types.includes('beauty_salon')) ? 'beauty_salon' : (locationData.types.includes('clothing_store')) ? 'clothing_store' : (locationData.types.includes('transit_station')) ? 'transit' : (locationData.types.includes('place_of_worship')) ? 'sanctuary' : (locationData.types.includes('natural_feature')) ? 'nature' : type.replace(/_store$/, ''))
                .map((type: string) => type.replace(/_/g, ' '))
            );

            const tags = (uniqueTags.size < 1) ? null : [...uniqueTags].join(', ');

            // Find zipcode => last or second to last index of address_components
            const addyArr = locationData.address_components;
            const zipcode = addyArr[addyArr.length - 1].types[0] === 'postal_code' ? addyArr[addyArr.length - 1].long_name : addyArr[addyArr.length - 2].long_name;

            const locationObj = {
                fullAddress: `${locationData.name} - ${address}`,
                address: address,
                venue: locationData.name,
                zipcode: zipcode,
                category: tags,
            };

            eventData.location.push(locationObj);
            locationAddress.value = eventData.location[0].fullAddress;

            console.log('tags', tags);
        } catch (error) {
            console.error(error);
        }
    }
}

function chargeFocus() {
    try {
        if (coverDmg?.value?.includes('$')) {
            coverDmg.value = coverDmg.value.slice(1);
        }
    } catch (error) {
        console.error(error);
    }
}

function chargeBlur() {
    if (!coverDmg.value) {
        return;
    }
    try {
        // eslint-disable-next-line unicorn/prefer-number-properties
        if (isNaN(coverDmg.value)) {
            toast.error('Cover charge must be a valid number!', { timeout: 1500 });
            coverDmg.value = '';
            // eslint-disable-next-line unicorn/prefer-number-properties
        } else if (!isNaN(coverDmg.value)) {
            const floatVal = Number.parseFloat(coverDmg.value).toFixed(2);
            eventData.coverCharge = floatVal;
            coverDmg.value = `$${floatVal}`;
        }
    } catch (error) {
        console.error(error);
    }
}

function partyBlur() {
    if (!partyCap.value || Number(partyCap.value) < 1) {
        partyCap.value = '';
        return;
    }
    try {
        // eslint-disable-next-line unicorn/prefer-number-properties
        if (isNaN(partyCap.value)) {
            toast.error('Party cap must be a valid number!', { timeout: 1500 });
            partyCap.value = '';
            // eslint-disable-next-line unicorn/prefer-number-properties
        } else if (!isNaN(partyCap.value)) {
            eventData.partySize = partyCap.value;
            const cap = Number(partyCap.value);
            partyCap.value = cap > 1 ? `${partyCap.value} spots` : `${partyCap.value} spot`;
        }
    } catch (error) {
        console.error(error);
    }
}
function partyFocus() {
    try {
        if (partyCap.value) {
            const cap = partyCap.value.split(' ');
            partyCap.value = cap.length > 1 ? cap[0] : partyCap.value;
        }
    } catch (error) {
        console.error(error);
    }
}

function startDateEmit(data: any) {
    eventData.startDate = data;
}
function coverPicEmit(data: any) {
    const subString = '&crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=70&w=600';
    const rawImg = data.replace(subString, '');
    eventData.eventPic = rawImg;
}
function coverModalEmit(data: any) {
    showModal.value = data;
}
function toggleModal() {
    showModal.value = !showModal.value;
}

function inviteUser() {
    try {
        const username = userSearch.value.trim();
        // Check if user is in newInvites array (already invited)
        // Note: invitation for initiator (host) will be created on event creation
        if (eventData.newInvites.some((user: any) => user.username === username) || username === myUsername) {
            toast.error('User is already on the invite list!', { timeout: 1700 });
            userSearch.value = '';
            return;
        }

        // Check if username exists in database
        const userRes: Record<string, any> = client(`${appHost}api/users?filters[username][$eq]=${username}`, {
            method: 'GET'
        });
        const user = userRes[0];
        if (userRes && user) {
            eventData.newInvites.push(user);
        } else {
            toast.error('User not found!', { timeout: 1700 });
        }
    } catch (error) {
        console.error(error);
    }
}

async function createInvites(eventRes: any) {
    createInviteAPI.value = true;

    // Create an array of promises for each invitation
    const invitePromises = eventData.newInvites.map((user: any) => {
        const inviteForm = new FormData();
        const inviteObj = {
            users_permissions_user: user,
            collection: 'event',
            event: eventRes,
            eventStatus: 'invited',
        };
        inviteForm.append('data', JSON.stringify(inviteObj));

        return client(`${appHost}api/invited-users`, {
            method: 'POST',
            body: inviteForm,
        });
    });

    try {
        await Promise.allSettled(invitePromises);
    } catch (error) {
        console.error('Error sending invites:', error);
    } finally {
        createInviteAPI.value = false;
    }

    // for (const user of eventData.newInvites) {
    //     const inviteForm = new FormData();
    //     const inviteObj = {
    //         users_permissions_user: user,
    //         collection: 'event',
    //         event: eventRes,
    //         eventStatus: 'invited',
    //     };
    //     inviteForm.append('data', JSON.stringify(inviteObj));

    //     try {
    //         const inviteRes: Record<string, any> = client(`${appHost}api/invited-users`, {
    //             method: 'POST',
    //             body: inviteForm,
    //         });
    //         const inviteData = inviteRes.data;
    //     } catch (error) {
    //         console.error(error);
    //     }
    // }
    // createInviteAPI.value = false;
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
        if (!eventData.partySize) {
            eventData.partySize = 0;
            partyCap.value = 'Unlimited spots';
        }
        if (!eventData.title) {
            toast.error('Title required!', { timeout: 1500 });
            return;
        } else if (!eventData.location[0]) {
            toast.error('Location required!', { timeout: 1500 });
            return;
        } else if (!eventData.startDate) {
            toast.error('Start Date required!', { timeout: 1500 });
            return;
        } else if (!eventData.eventPic) {
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
            partySize: eventData.partySize,
            coverCharge: eventData.coverCharge,
            info: eventData.info,
        };

        // Fetch img URL, convert response to blob
        const imgRes: any = await fetch(eventData.eventPic);
        const imgBlob = await imgRes.blob();
        const imgName = `${eventData.title}_eventPic`;

        // Append event input fields and cover image
        formData.append('data', JSON.stringify(form));
        formData.append('files.eventPic', imgBlob, imgName);

        const eventRes: Record<string, any> = await $fetch(`${appHost}api/events`, {
            method: 'POST',
            body: formData,
        });
        const eventResult = eventRes.data;

        // (2) Create 'going' invite for event host (initiator)
        const hostInviteForm = new FormData();
        const hostInviteObj = {
            users_permissions_user: user,
            collection: 'event',
            event: eventResult,
            eventStatus: 'going',
        };
        hostInviteForm.append('data', JSON.stringify(hostInviteObj));

        $fetch(`${appHost}api/invited-users`, {
            method: 'POST',
            body: hostInviteForm,
        });

        // (3) Create 'invited' invitation for each user in newInvites array
        createInvites(eventResult);

        createEventAPI.value = false;
        toast.success('New event created!', { timeout: 1500 });
        setTimeout(() => {
            navigateTo('/events');
        }, 2000);
    } catch (error: any) {
        console.error(error);
    }
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
            <div class="flex flex-col lg:flex-row w-full justify-center sm:px-20">
                <div class="sm:w-auto min-w-[10%] lg:min-w-[42%]">
                    <div class="card-body pb-1.5">

                        <div class="w-full con-hint top pb-2 sm:order-first">
                            <div class="hint">
                                <p>Event Title*</p>
                            </div>
                            <input v-model="eventData.title" placeholder="Untitled Event" name="title" type="text"
                                class="input input-bordered form-input" />
                        </div>

                        <div class="lg:hidden">
                            <div @click="toggleModal">
                                <button v-if="!showModal && !eventData.eventPic"
                                    class="edit edit-primary min-w-[100%] lg:min-w-[80%] h-full lg:h-[90%]">
                                    Cover Picture</button>
                                <img v-if="!showModal && eventData.eventPic" :src="eventData.eventPic" alt="Cover"
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
                        </div>

                        <div class="w-full con-hint left py-0">
                            <div class="hint">
                                <p>Location*</p>
                            </div>
                            <input id="autocomplete" v-model="locationAddress" name="location" type="text"
                                placeholder="Where at?" class="input input-bordered form-input" @blur="locationInput" />
                        </div>

                        <div class="w-full con-hint left pb-0">
                            <div class="hint">
                                <p>Start Date*</p>
                            </div>
                            <VPicker @startDateInput="startDateEmit" />
                        </div>

                        <div class="w-full con-hint left pb-0 lg:pb-2">
                            <div class="hint">
                                <p>Party Size</p>
                            </div>
                            <input v-model="partyCap" placeholder="Unlimited" name="capacity" type="text"
                                class="input input-bordered form-input" @blur="partyBlur" @focus="partyFocus" />
                        </div>

                        <div class="w-full con-hint left pb-0 lg:pb-2">
                            <div class="hint">
                                <p>Damage</p>
                            </div>
                            <input id="cover" v-model="coverDmg" placeholder="Cover charge" name="cover" type="text"
                                class="input input-bordered form-input" @blur="chargeBlur" @focus="chargeFocus" />
                        </div>

                        <div class="con-hint left w-full">
                            <div class="hint">
                                <p>The Deets</p>
                            </div>
                            <textarea v-model="eventData.info" placeholder="Whose birthday is it this time?" type="text"
                                name="description"
                                class="textarea text-bordered textarea-neutral form-input h-20 resize whitespace-normal" />
                        </div>

                        <div class="lg:hidden">
                            <input v-model="userSearch" placeholder="Invite by username" name="title" type="text"
                                :class="validInvite" @keyup.enter="inviteUser" @input="debouncedUserSearch" />

                            <ul v-if="matchingUsers.length > 0" class="menu w-full rounded-box py-0 pt-1">
                                <li v-for="username in matchingUsers" :key="username" class="text-accent py-0 my-0"
                                    @click="selectInviteUser(username)"><a
                                        class="px-1.5 py-[0.175rem] text-xs text-center w-fit">{{ username }}</a></li>
                            </ul>

                            <div v-if="eventData.newInvites.length > 0" class="align-top"
                                :class="matchingUsers.length > 0 ? '' : 'pt-0.5'">
                                <div v-for="(user, index) in eventData.newInvites" :key="index"
                                    class="inline-block whitespace-nowrap pl-1">
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

                <div class="hidden md:block w-full h-full pt-8 px-8 lg:px-0">

                    <div class="justify-center content-center self-center items-center max-h-full hidden lg:block">
                        <div @click="toggleModal">
                            <button v-if="!showModal && !eventData.eventPic"
                                class="edit edit-primary min-w-[100%] lg:min-w-[80%] h-full lg:h-[90%]">
                                Cover Picture</button>
                            <img v-if="!showModal && eventData.eventPic" :src="eventData.eventPic" alt="Cover"
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

                        <div class="w-full lg:w-[80%] h-full lg:h-[90%] con-hint right pt-4">
                            <div class="hint lg:pt-3">
                                <p>Invite Friends</p>
                            </div>
                            <input v-model="userSearch" placeholder="Invite by username" name="title" type="text"
                                :class="validInvite" @keyup.enter="inviteUser" @input="debouncedUserSearch" />
                        </div>

                        <ul v-if="matchingUsers.length > 0" class="menu w-fit rounded-box">
                            <li v-for="username in matchingUsers" :key="username" class="text-accent"
                                @click="selectInviteUser(username)"><a
                                    class="px-1.5 py-[0.175rem] text-xs text-center w-fit">{{ username }}</a></li>
                        </ul>

                        <div v-if="eventData.newInvites.length > 0" class="flex items-center w-full lg:w-[80%]"
                            :class="matchingUsers.length > 0 ? '' : 'pt-2.5'">
                            <div v-for="(user, index) in eventData.newInvites" :key="index"
                                class="grid grid-flow-col-dense gap-1 pl-1">
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

                    <!-- <div
                        class="absolute top-32 sm:top-60 lg:right-36 md:right-32 sm:right-32 max-sm:-translate-x-full max-sm:left-14 pointer-events-none z-0">
                        <Bubbles />
                    </div> -->

                </div>

                <div class="">
                    <div
                        class="absolute top-32 sm:top-40 sm:right-28 lg:right-36 md:right-32 max-sm:-translate-x-full max-sm:left-14 pointer-events-none z-0">
                        <Bubbles />
                    </div>
                </div>

            </div>
        </div>

        <div class="sm:px-24 pb-10 lg:pl-0">

            <div class="flex items-center justify-center place-content-center">
                <button v-if="!createEventAPI && !createInviteAPI" class="event-create" :class="eventBtnClass" type="submit"
                    @click="createEvent">
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
