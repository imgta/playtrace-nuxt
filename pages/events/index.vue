<script setup lang="ts">
import '@/assets/css/button.css';
import BubblesDark from '@/components/styles/BubblesDark.vue';
import Bubbles from '@/components/styles/Bubbles.vue';

const { register } = useStrapiAuth();
const { toast } = useMisc();

const popForm = ref<any | null>(null);
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie.value) as any;
const buttonTheme = ref('');

const userData = reactive({
    fullname: '',
    email: '',
    username: '',
    password: '',
});

// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await register({ username: userData.username, email: userData.email, fullName: userData.fullname, password: userData.password, });
        navigateTo('/');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}

function openSignup() {
    if (popForm.value) {
        popForm.value.showModal();
    }
}

// ----------------------------------------------------------------
const formBg = computed(() => {
    return {
        'bg-base-200/95': pageTheme.value === 'dracula' || 'night',
        'bg-neutral/95': pageTheme.value === 'fantasy' || 'corporate',
    };
});

watchEffect(() => {
    if (themeCookie.value === 'corporate') {
        buttonTheme.value = 'signupcorp';
    } else {
        buttonTheme.value = 'signup';
    }
    console.log(themeCookie);
});

// console.log(themeCookie);
</script>

<template>
<div class="flex flex-col w-full lg:flex-row">
    <form :class="formBg" class="flex w-auto max-fit shadow-none">
    <div class="grid flex-grow h-fit card rounded-box place-items-center">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Link Up!
        </h1>
        <p class="text-neutral-content/80 text-center text-sm">
            Two's a party, three's a crowd.
        </p>
        <div class="card-body pt-5 pb-1.5 bg-none">
            <div class="focus:text-base-content bg-none placeholder:text-opacity-75 placeholder:text-neutral focus:placeholder-transparent placeholder:border-inherit">
                <label class="label-text text-neutral-content/80">Event Title</label>
                <input
                    placeholder="Untitled"
                    required
                    type="text"
                    name="fullname"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Location</label>
                <input
                    type="text"
                    name="location"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Spots</label>
                <input
                    type="text"
                    name="username"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Cost</label>
                <input
                    type="text"
                    name="cost"
                    class="form-control input input-bordered focus:bg-base-100 w-full"
                />
                <label class="label-text text-neutral-content/80">Description</label>
                <textarea
                    placeholder="Whose birthday is it this time?"
                    type="text"
                    name="description"
                    class="textarea text-bordered textarea-sm textarea-neutral focus:bg-base-100 w-full"
                />
            </div>

            <div class="flex justify-center items-center w-full h-14 pr-3.5">
                <button type="submit" :class="buttonTheme" @click="onSubmit">
                    <span>Send It</span>
                    <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                        <path d="M1,5 L11,5"></path>
                        <polyline points="8 1 12 5 8 9"></polyline>
                    </svg>
                </button>
            </div>
            <label class="label m-0 pt-2 pb-0 justify-center">
                <NuxtLink to="/" class="link link-hover hover:link-primary">
                    <span class="label-text-alt text-neutral-content/75 hover:text-neutral-content font-extralight pl-1.5">
                        Have we met before?
                    </span>
                </NuxtLink>
            </label>
        </div>
    </div>
    </form>
<!-- <Bubbles /> -->
    <div class="divider flex-1 lg:divider-horizontal place-items-center">
        <div v-show="themeCookie === 'dracula' || themeCookie === 'night'">
        <Bubbles />
    </div>
    <div v-show="themeCookie === 'fantasy' || themeCookie === 'corporate'">
        <BubblesDark />
    </div>
    </div>
    <div class="grid flex-2 h-fit card rounded-box place-items-center">

    </div>
</div>
</template>
