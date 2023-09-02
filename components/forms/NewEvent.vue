<script setup lang="ts">
// ----------------------------------------------------------------
const themeCookie = useCookie('selectedTheme');
const corpoLogin = ref('');
const eventData = reactive({
    title: '',
    startDate: '',
    location: '',
    size: '',
    cost: '',
    info: '',
    img: '',
});
const locationType = ref([]);
const showModal = ref(false);
const { create } = useStrapi4();

// ----------------------------------------------------------------
async function balanceBlur() {
    if (eventData.cost) {
        const val = eventData.cost;
        const floatVal = Number.parseFloat(val).toFixed(2);
        eventData.cost = floatVal;
    }
}

async function locationEmit(data: any) {
    const { name, formatted_address, types } = await data;
    eventData.location = `${name} ${formatted_address}`;
    locationType.value = types;
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

async function createEvent() {
    try {
        await create('events',
            {
                name: eventData.title
            }
        );
        // console.log('eventData.title', eventData.title);
    } catch (e: any) {
        console.error(e);
    } finally {
        console.log('Event created!');
    }
}
// ----------------------------------------------------------------
watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        corpoLogin.value = 'signupcorp';
    } else {
        corpoLogin.value = 'signup';
    }
    console.log('Title:', eventData.title);
    console.log('Start Date:', eventData.startDate);
    console.log('Location:', eventData.location);
    console.log('Location Type:', locationType.value);
    console.log('Party Size:', eventData.size);
    console.log('Cost:', eventData.cost);
    console.log('Details:', eventData.info);
    console.log('Cover Pic:', eventData.img);
});

watch(eventData, eventInput => {
    if (eventInput.location) {
        eventData.location = eventInput.location;
    }
    if (eventInput.startDate) {
        eventData.startDate = eventInput.startDate;
    }
});
// ----------------------------------------------------------------
</script>

<template>
<div>
<div class="">
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
                    <div class="w-full con-hint top pb-0">
                        <div class="hint ">
                            <p>Event Title</p>
                        </div>
                        <input
                            v-model="eventData.title"
                            placeholder="Untitled Event"
                            name="title"
                            type="text"
                            class="input input-bordered form-input"
                        />
                    </div>

                    <div class="w-full con-hint left pb-0">
                        <div class="hint">
                            <p>Select Date</p>
                        </div>
                        <DatetimeVPicker
                            @startDateInput="startDateEmit"
                        />
                    </div>

                    <div class="w-full con-hint left pb-2">
                        <div class="hint ">
                            <p>Location</p>
                        </div>
                        <GoogleAutoMap
                            @addressInput="locationEmit"
                        />
                    </div>

                    <div class="w-full con-hint left pb-2">
                        <div class="hint">
                            <p>Party Size</p>
                        </div>
                        <input
                            v-model="eventData.size"
                            placeholder="Unlimited"
                            name="capacity"
                            type="text"
                            class="input input-bordered form-input"
                        />
                    </div>

                    <div class="w-full con-hint left pb-2">
                        <div class="hint">
                            <p>Damage</p>
                        </div>
                            <input
                                v-model="eventData.cost"
                                placeholder="Cost of entry"
                                name="cover"
                                type="text"
                                class="input input-bordered form-input"
                                @focusout="balanceBlur"
                            />
                    </div>

                    <div class="con-hint left w-full">
                        <div class="hint">
                            <p>The Deets</p>
                        </div>
                            <textarea
                                v-model="eventData.info"
                                placeholder="Whose birthday is it this time?"
                                type="text"
                                name="description"
                                class="textarea text-bordered textarea-sm textarea-neutral form-input h-16 lg:max-w-[100%] sm:max-w-[100%] resize"
                            />
                    </div>

            </div>
        </div>

        <div class="w-full pt-8 lg:pl-0 sm:px-8 max-sm:px-8">

            <div class="justify-center content-center self-center items-center">
                <div @click="toggleModal">
                    <button
                        v-if="!showModal && !eventData.img"
                        class="edit edit-primary lg:min-w-[80%] sm:min-w-[100%] max-sm:min-w-[100%] lg:h-[90%] sm:h-full "
                        >
                        Cover Picture</button>
                    <img
                        v-if="!showModal && eventData.img"
                        :src="eventData.img" alt="Cover"
                        class="edit edit-primary object-cover h-[24rem] w-[80%] sm:w-[100%] max-sm:w-[100%]"
                    />
                </div>

                <div v-if="showModal">
                    <dialog
                        class="modal"
                        :class="{ 'modal-open': showModal }"
                    >
                        <div method="dialog" class="modal-box max-w-4xl">
                            <FormsCoverTest
                                @coverPicInput="coverPicEmit"
                                @modalState="coverModalEmit"
                            />
                        </div>
                        <form method="dialog" class="modal-backdrop" @click="toggleModal">
                            <button>close</button>
                        </form>
                    </dialog>
                </div>

            </div>

            <div class="absolute top-[16%] left-[77.5%] pointer-events-none">
                <StylesBubbles />
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
</div>
</template>
