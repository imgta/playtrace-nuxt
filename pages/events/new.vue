<script setup lang="ts">
const client = useStrapiClient();
const myCookie: any = useCookie('userCookie').value;
const themeCookie = useCookie('selectedTheme');
const corpoLogin = ref('');
const eventData = reactive({
    title: '',
    startDate: '',
    location: '',
    size: '',
    coverCharge: '',
    info: '',
    img: '',
    categories: '',
});
const showModal = ref(false);
// ----------------------------------------------------------------
onMounted(() => {
    // @ts-expect-error idk
    const autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'));
    autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log('place', place);
        eventData.location = place.formatted_address;
    });
});

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        corpoLogin.value = 'signupcorp';
    } else {
        corpoLogin.value = 'signup';
    }
    console.log('eventData.location', eventData.location);
    console.log('eventData.startDate', eventData.startDate);
});
// ----------------------------------------------------------------
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

async function locationEmit(data: any) {
    console.log('zip', data.address_components[7].long_name);
    const { name, formatted_address, types, address_components } = await data;
    const address = formatted_address.replace(', USA', '');
    console.log(address);
    const zipcode = address_components[7].long_name;

    eventData.location = `${name} ${address}`;

    console.log(eventData.location);
    // Filter out irrelevant types from the types array
    const categories = types.filter((type: string) => !['tourist_attraction', 'point_of_interest', 'establishment'].includes(type));
    console.log('categories', categories[0]);
    eventData.categories = categories[0];
    console.log('eventData.categories', eventData.categories);
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
        const imgName = `${eventData.title}-eventPic`;

        // Append field data
        formData.append('data', JSON.stringify(form));
        // Append file image
        formData.append('files.eventPic', imgBlob, imgName);

        const eventRes: Record<string, any> = await client('http://localhost:1337/api/events', {
            method: 'POST',
            body: formData,
        });
        const result = await eventRes.data;
        console.log(result);

        // UPDATE EVENT COVER PICTURE:
        // const formData = new FormData();
        // formData.append('ref', 'api::event.event');
        // formData.append('refId', result.id);
        // formData.append('field', 'eventPic');
        // formData.append('files', imgBlob, imgName);

        // const postRes: Record<string, any> = await client('http://localhost:1337/api/upload', {
        //     method: 'POST',
        //     body: formData,
        // });
        // console.log('postRes', postRes);
    } catch (e: any) {
        console.error(e);
    } finally {
        console.log('Event created!');
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

                            <input id="autocomplete" v-model="eventData.location" type="text"
                                placeholder="Enter your address" class="input input-bordered form-input">

                            <!-- <GoogleAutoMap @addressInput="locationEmit" /> -->

                        </div>

                        <div class="w-full con-hint left py-0">
                            <div class="hint">
                                <p>Select Date</p>
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
                                class="edit edit-primary lg:min-w-[80%] sm:min-w-[100%] max-sm:min-w-[100%] lg:h-[90%] sm:h-full ">
                                Cover Picture</button>
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
