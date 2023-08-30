<script setup lang="ts">
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

// ----------------------------------------------------------------
</script>

<template>
<div>
<div class="sm:pl-24 lg:pl-0">
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
    <form class="flex w-full shadow-none justify-center">
        <div class="flex lg:flex-row sm:flex-col-reverse max-sm:flex-col-reverse w-full justify-center sm:px-20">

        <div class="sm:w-auto lg:min-w-[42%] sm:min-w-[10%]">
            <div class="card-body pb-1.5">
                    <div class="w-full con-hint top pb-2">
                        <div class="hint ">
                            <p>Event Title</p>
                        </div>
                        <input
                            placeholder="Untitled Event"
                            name="title"
                            type="text"
                            class="input input-bordered form-input"
                            required
                        />
                    </div>

                    <div class="w-full con-hint left pb-2">
                        <div class="hint">
                            <p>Select Date</p>
                        </div>
                        <DatetimeVPicker />
                    </div>

                    <div class="w-full con-hint left pb-2">
                        <div class="hint ">
                            <p>Location</p>
                        </div>
                        <GoogleAutoMap />
                    </div>

                    <div class="w-full con-hint left pb-2">
                        <div class="hint">
                            <p>Party Size</p>
                        </div>
                        <input
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
                                placeholder="Cost of entry"
                                name="cover"
                                type="text"
                                class="input input-bordered form-input"
                            />
                    </div>

                    <div class="con-hint left w-full">
                        <div class="hint">
                            <p>The Deets</p>
                        </div>
                            <textarea
                                placeholder="Whose birthday is it this time?"
                                type="text"
                                name="description"
                                class="textarea text-bordered textarea-sm textarea-neutral form-input h-16 lg:max-w-[100%] sm:max-w-[100%] resize"
                            />
                    </div>

            </div>
        </div>

        <div class="w-full pt-8 lg:pl-0 sm:px-8 max-sm:px-8">

                <FormsCoverPic />

            <!-- <div class="con-hint left pt-2 w-full">
                <div class="hint">
                    <p class="leading-4 text-right">The Deets!</p>
                </div>
                    <textarea
                        placeholder="Whose birthday is it this time?"
                        type="text"
                        name="description"
                        class="textarea text-bordered textarea-sm textarea-neutral form-input h-16 lg:max-w-[80%] sm:max-w-[100%] resize"
                    />
            </div> -->

            <div class="absolute top-[16%] left-[77.5%] pointer-events-none">
                <StylesBubbles />
            </div>
        </div>

        </div>

    </form>

    <div class="sm:px-24 lg:pl-0">
        <div class="flex items-center justify-center place-content-center">
            <button :class="corpoLogin" type="submit">
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

<style scoped>
.con-hint {
    display: inline-block;
    /* width: 100%; */
    position: relative;
    cursor: default;
    transition: all 0.25s ease-in-out; /* Hint container move speed */
}

.hint {
    visibility: hidden;
    z-index: 1;
    opacity: 0.8;
    color: hsl(var(--af));
    font-weight: 400;
    font-size: 0.9rem;
    transition: all 0s ease-in-out; /* Hint fade speed */
    position: absolute;
    width: 45%;
}

.con-hint:hover .hint  {
    opacity: 1;
    visibility: visible;
    animation: nudge 0.45s ease-in-out infinite alternate; /* Hint animation effect speed */
    position: absolute;
}

.con-hint:focus-within .hint {
    opacity: 1;
    visibility: visible;
    animation: nudge 0.45s ease-in-out infinite alternate;
    position: absolute;
}

@keyframes nudge {
    0% { transform: translateY(6px); }
    100% { transform: translateY(1px); }
}

/* Hover shift direction */
.left:hover, .top:hover, .bottom:hover {transform: translateX(-12px); }
.right:hover { transform: translateX(12px); }
/* .top:hover {transform: translateY(-12px); }
.bottom:hover {transform: translateY(12px); }
.right:hover {transform: translateX(12px); } */

.top .hint { top:-49.5%; left:1.5%; }
.bottom .hint { top:95.5%; left:1.5%; }
.left .hint { top:21%; left:-46.5%; text-align:right;}
.right .hint { top:21%; left:46.5%; text-align:left;}

@media (max-width: 640px) {
    /* Disable animation and reposition for max-sm screens */
    .con-hint:hover .hint,
    .con-hint:focus-within .hint {
        opacity: 1;
        visibility: visible;
        animation: none; /* Disable animation */
        transform: none; /* Remove position adjustments */
        position: relative; /* Reset position */
    }

    /* Reset hover shift direction for max-sm screens */
    .left:hover,
    .top:hover,
    .bottom:hover,
    .right:hover {
        transform: none;
    }

    /* Reset hint position for max-sm screens */
    .top .hint,
    .bottom .hint,
    .left .hint,
    .right .hint {
        top: auto;
        left: auto;
        text-align: left;
    }
}
</style>
