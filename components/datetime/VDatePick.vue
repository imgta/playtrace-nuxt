<script setup lang="ts">
import 'v-calendar/style.css';
import '@/assets/css/input.css';
import { DatePicker } from 'v-calendar';

const date = ref('');
const formatDate = ref('');
const popDate = ref(false);

const inputStyle = ref('');

function format(date: Date) {
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    };
    const formattedTime = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${date.toLocaleDateString('en-US', options)} @ ${formattedTime}`;
};

function dateInput(newDate) {
    formatDate.value = format(newDate);
}

function openDate() {
    if (popDate.value) {
        popDate.value.showModal();
    }
}

function inputBlur() {
    popDate.value = false;
    inputStyle.value = '';
    dateInput(date.value);
    console.log(date.value);
}

watch(date, newDate => {
    formatDate.value = format(newDate);
});
</script>

<template>
<div class="pt-2">
    <input
        v-model="formatDate"
        placeholder="When were you thinking?"
        class="input input-bordered form-input"
        @click="openDate"
    />
    <dialog id="my_modal_4" ref="popDate" class="modal">
        <form method="dialog" class="modal-box shadow-none bg-base-200 w-fit">

            <div class="my-calendar">
                <DatePicker
                v-model="date"
                mode="dateTime"
                @input="dateInput"
            />
            </div>

        </form>
        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</div>

<!-- <div class="bg-base-200 pt-1.5">
    <input
        v-model="formatDate"
        placeholder="Select Date"
        class="input input-bordered form-input"
        :style="inputStyle"
        @focusin="inputFocus"
        />
    <div v-show="popDate" class="my-calendar pt-1">
        <DatePicker
            v-model="date"
            mode="dateTime"
            class="select-none"
            @input="dateInput"
            />
    </div>
</div> -->

<!-- <div class="justify-center content-center align-middle items-center">
    <div class="collapse w-full">
        <input type="checkbox" class="" />
        <div class="collapse-title text-xl font-medium">
            <input
                v-model="formatDate"
                placeholder="Select Date"
                class="input input-bordered form-input"
                />
        </div>
        <div class="collapse-content">
            <div class="my-calendar pt-1">
                <DatePicker
                    v-model="date"
                    mode="dateTime"
                    class="select-none"
                    @input="dateInput"
                    />
            </div>
        </div>
    </div>
</div> -->
</template>

<style scoped>
.my-calendar :deep(:is(.vc-time-colon, select.vc-focus.vc-align-right, select.vc-focus.vc-align-left, .vc-align-right option)) {
    color: hsl(var(--bc));
    border-color: hsl(var(--p));
    border-radius: var(--rounded-btn, 0.5rem);
}
.my-calendar :deep(:is(select.vc-focus.vc-align-right option, select.vc-focus.vc-align-left option, select.vc-focus option)) {
    background-color: hsl(var(--b2) / 1);
    border-color: hsl(var(--p));
    border-radius: var(--rounded-btn, 0.5rem);
    color: hsl(var(--p) / 0.8);
}

.my-calendar :deep(:is(.vc-highlight-content-solid)) {
    color: hsl(var(--nc));
    background-color: hsl(var(--p));
}

.my-calendar :deep(:is(.vc-light, .vc-attr, .vc-light.vc-attr)) {
    --vc-bg: hsl(var(--bc) / 0);
    --vc-border: hsl(var(--p));
    --vc-header-title-color: hsl(var(--p));
    --vc-header-arrow-color: hsl(var(--pf));
    --vc-header-arrow-hover-bg: hsl(var(--bc) / 0.2);
    --vc-hover-bg: hsl(var(--bc) / 0.2);
    --vc-weekday-color: hsl(var(--bc));
    --vc-weeknumber-color: hsl(var(--bc));
    --vc-white: hsl(var(--bc) / 0.8);
    --vc-accent-color: hsl(var(--p));
    --vc-color: hsl(var(--bc)/0.8);
    --vc-time-month-color: hsl(var(--p));
    --vc-time-day-color: hsl(var(--p));
    --vc-time-year-color: hsl(var(--bc) / 0.8);
    --vc-time-weekday-color: hsl(var(--bc) / 0.8);
    --vc-time-select-group-icon-color: hsl(var(--p));
    --vc-time-picker-border: hsl(var(--p));     /* Divider */
    --vc-time-select-group-bg: hsl(var(--bc) / 0);
    --vc-time-select-group-border: hsl(var(--pf)/0);
    --vc-select-color: hsl(var(--p));
    --vc-select-hover-bg: hsl(var(--bc)/0.2);
    --vc-content-color: hsl(var(--p));
    --vc-focus-ring: 0 0 0 2px hsl(var(--p) / 0.4);
    --vc-select-bg: none;
    --vc-select-border: none;
}
</style>
