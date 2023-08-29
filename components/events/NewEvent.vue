<script setup lang="ts">
import '@/assets/css/button.css';
import '@/assets/css/input.css';
import Bubbles from '@/components/styles/Bubbles.vue';
import CoverPic from '@/components/events/CoverPic.vue';
import VDatePick from '@/components/datetime/VDatePick.vue';

const { toast } = useMisc();

const themeCookie = useCookie('selectedTheme');
const corpoLogin = ref('');

const eventData = reactive({
    title: '',
    start: '',
    location: '',
    size: '',
    cost: '',
    info: '',
    pic: '',
});

// ----------------------------------------------------------------

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        corpoLogin.value = 'signupcorp';
    } else {
        corpoLogin.value = 'signup';
    }
});

async function onSubmit() {
    try {
        await register({ username: userData.username, email: userData.email, fullName: userData.fullname, password: userData.password, });
        navigateTo('/');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

// ----------------------------------------------------------------
</script>

<template>
<div class="flex lg:flex-row items-center justify-center content-center bg-base-200">
    <h1 class="text-primary text-4xl text-center pt-8">
        New Event!
    </h1>
</div>
<div>
    <p class="text-base-content/90 text-center text-sm">
            Two's a party, three's a crowd.
    </p>
</div>

<div class="bg-base-200">
    <form class="flex w-full shadow-none justify-center">
        <div class="flex lg:flex-row w-full justify-center">

        <div class="w-1/3">

            <div class="card-body pb-1.5">
                <div>
                    <!-- <label class="label-text text-base-content/90">Event Title</label> -->
                    <div class="lg:tooltip tooltip-primary w-full pb-2" data-tip="Event Title">
                    <input
                        placeholder="Untitled Event"
                        required
                        type="text"
                        class="form-control input input-bordered form-input"
                    />
                    </div>
                    <!-- <label class="label-text text-base-content/90">Start Date</label> -->
                    <div class="lg:tooltip tooltip-primary tooltip-left w-full" data-tip="Start Date">
                        <VDatePick />
                    </div>
                    <label class="label-text text-base-content/90">Location</label>
                    <input
                        placeholder="Where were you thinking?"
                        type="text"
                        class="form-control input input-bordered form-input"
                    />
                    <label class="label-text text-base-content/90">Max Cap.</label>
                    <input
                        placeholder="Unlimited"
                        type="text"
                        class="form-control input input-bordered form-input"
                    />
                    <label class="label-text text-base-content/90">Cover Charge</label>
                    <input
                        placeholder="Cost of entry"
                        type="text"
                        class="form-control input input-bordered form-input"
                    />

                </div>
            </div>

        </div>

        <div class="pt-14">
            <CoverPic />

            <label class="label-text text-base-content/90">Description</label>
                    <textarea
                        placeholder="Whose birthday is it this time?"
                        type="text"
                        name="description"
                        class="textarea text-bordered textarea-sm textarea-neutral form-input h-14"
                    />

                <div class="flex justify-center">
                    <button :class="corpoLogin" type="submit" @click="onSubmit">
                        <span>Create </span>
                        <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>
                </div>

        </div>
        <div class="flex-shrink align-top justify-center">
            <Bubbles />
        </div>

        </div>

    </form>

</div>
</template>
