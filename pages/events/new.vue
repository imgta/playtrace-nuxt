<script setup lang="ts">
const { toast } = useMisc();
const client = useStrapiClient();
const { url: appHost } = useRuntimeConfig().public.strapi;
const myCookie: any = useCookie('userCookie').value;
const themeCookie = useCookie('selectedTheme');

const corpoLogin = ref('');
const showModal = ref(false);

const autoResult: any = ref(null);
const eventData = reactive({
    title: '',
    startDate: '',
    location: [],
    size: '',
    coverCharge: '',
    info: '',
    img: '',
}) as any;

const user = useStrapiUser().value;
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

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        corpoLogin.value = 'signupcorp';
    } else {
        corpoLogin.value = 'signup';
    }
    console.log('autoResult.value', autoResult.value);
});
// ----------------------------------------------------------------
async function locationInput() {
    if (autoResult.value) {
        try {
            const address = await autoResult.value.formatted_address.replace(', USA', '');

            // Filter out irrelevant/redundant types from the types array
            const categories = autoResult.value.types.filter((type: string) => !['tourist_attraction', 'point_of_interest', 'establishment', 'meal_delivery', 'meal_takeaway'].includes(type));
            // Join the categories into a single string
            const categoryStr = categories.join(', ');
            // Find last index of address_components (zipcode component)
            const zipcode = autoResult.value.address_components[autoResult.value.address_components.length - 1].long_name;
            console.log('zipcode', zipcode);
            const locationObj = {
                fullAddress: `${autoResult.value.name} - ${address}`,
                address: address,
                venue: autoResult.value.name,
                zipcode: zipcode,
                category: categoryStr,
            };
            eventData.location.push(locationObj);
        } catch (error) {
            console.error(error);
        }
    }
}

async function balanceBlur() {
    if (eventData.coverCharge) {
        const val = eventData.coverCharge;
        const floatVal = Number.parseFloat(val).toFixed(2);
        eventData.coverCharge = floatVal;
    }
    if (!eventData.coverCharge) {
        const zeroCharge = '0';
        const zeroFloat = Number.parseFloat(zeroCharge).toFixed(2);
        eventData.coverCharge = zeroFloat;
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
        const formData = new FormData();
        const form = {
            initiator: myCookie,
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

        // Append field data
        formData.append('data', JSON.stringify(form));
        // Append file image
        formData.append('files.eventPic', imgBlob, imgName);

        const eventRes: Record<string, any> = await client(`${appHost}api/events`, {
            method: 'POST',
            body: formData,
        });
        const eventResult = await eventRes.data;
        console.log('eventResult', eventResult);

        // Create an 'accepted' event invitation for event host (initiator)
        const inviteForm = new FormData();
        const inviteObj = {
            collection: 'event',
            eventStatus: 'going',
            users_permissions_user: user,
            event: eventResult,
        };
        inviteForm.append('data', JSON.stringify(inviteObj));
        const inviteRes: Record<string, any> = await client(`${appHost}api/invited-users`, {
            method: 'POST',
            body: inviteForm,
        });
        const inviteData = await inviteRes.data;
        console.log('inviteData', inviteData);

        // UPDATE EVENT COVER PICTURE:
        // const formData = new FormData();
        // formData.append('ref', 'api::event.event');
        // formData.append('refId', result.id);
        // formData.append('field', 'eventPic');
        // formData.append('files', imgBlob, imgName);

        // const postRes: Record<string, any> = await client(`${appHost}api/upload`, {
        //     method: 'POST',
        //     body: formData,
        // });
        // console.log('postRes', postRes);
    } catch (error: any) {
        console.error(error);
    } finally {
        toast.info('New event created!', { timeout: 1500 });
        navigateTo('/events');
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
            <div class="flex lg:flex-row sm:flex-col-reverse max-sm:flex-col-reverse w-full justify-center sm:px-20">
                <div class="sm:w-auto lg:min-w-[42%] sm:min-w-[10%]">
                    <div class="card-body pb-1.5">

                        <div class="w-full con-hint top pb-2">
                            <div class="hint ">
                                <p>Event Title</p>
                            </div>
                            <input v-model="eventData.title" placeholder="Untitled Event" name="title" type="text"
                                class="input input-bordered form-input" />
                        </div>

                        <div class="w-full con-hint left">
                            <div class="hint ">
                                <p>Location</p>
                            </div>
                            <input id="autocomplete" v-model="eventData.location.full_address" type="text"
                                placeholder="Enter your address" class="input input-bordered form-input" />
                        </div>

                        <div class="w-full con-hint left py-0">
                            <div class="hint">
                                <p>Start Date</p>
                            </div>
                            <VPicker @startDateInput="startDateEmit" />
                        </div>

                        <div class="w-full con-hint left pb-2">
                            <div class="hint">
                                <p>Party Size</p>
                            </div>
                            <input v-model="eventData.size" placeholder="Unlimited" name="capacity" type="text"
                                class="input input-bordered form-input" />
                        </div>

                        <div class="w-full con-hint left pb-2">
                            <div class="hint">
                                <p>Damage</p>
                            </div>
                            <input v-model="eventData.coverCharge" placeholder="Cost of entry" name="cover" type="text"
                                class="input input-bordered form-input" @focusout="balanceBlur" />
                        </div>

                        <div class="con-hint left w-full">
                            <div class="hint">
                                <p>The Deets</p>
                            </div>
                            <textarea v-model="eventData.info" placeholder="Whose birthday is it this time?" type="text"
                                name="description"
                                class="textarea text-bordered textarea-sm textarea-neutral form-input h-16 lg:max-w-[100%] sm:max-w-[100%] resize" />
                        </div>

                    </div>
                </div>

                <div class="w-full h-full pt-8 lg:pl-0 sm:px-8 max-sm:px-8">
                    <div class="justify-center content-center self-center items-center">

                        <div @click="toggleModal">
                            <button v-if="!showModal && !eventData.img"
                                class="edit edit-primary lg:min-w-[80%] sm:min-w-[100%] max-sm:min-w-[100%] lg:h-[90%] sm:h-full ">Cover
                                Picture</button>
                            <img v-if="!showModal && eventData.img" :src="eventData.img" alt="Cover"
                                class="edit edit-primary object-cover h-[24rem] w-[80%] sm:w-[100%] max-sm:w-[100%]" />
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

                    <div
                        class="absolute top-60 lg:right-36 md:right-32 sm:right-32 max-sm:-translate-x-full max-sm:left-14 max-sm:top-32 pointer-events-none z-0">
                        <Bubbles />
                    </div>

                </div>
            </div>
        </div>

        <div class="sm:px-24 sm:pb-10 lg:pl-0">
            <div class="flex items-center justify-center place-content-center">
                <button :class="corpoLogin" type="submit" @click="createEvent">
                    <span>Create </span>
                    <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </div>
        </div>

    </div>
</template>
