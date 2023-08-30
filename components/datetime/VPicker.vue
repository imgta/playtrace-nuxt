<script setup lang="ts">
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

const date = ref(new Date());
const formatDate = ref('');
const popDate = ref(false);

const inputStyle = ref('');

function format(date: Date | string) {
    const options = {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    };

    const formattedTime = date.toLocaleString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
    return `${date.toLocaleString('en-US', options)} @ ${formattedTime}`;
};

function dateInput(newDate: any) {
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
<div>
    <input
        v-model="formatDate"
        placeholder="When were you thinking?"
        class="input input-bordered form-input cursor-pointer"
        @click="openDate"
    />
    <dialog v-show="popDate" id="my_modal_4" ref="popDate" class="modal">

        <form method="dialog" class="modal-box shadow-none w-fit m-0 p-0.5">
            <div class="mycalendar">
                <DatePicker
                v-model="date"
                mode="dateTime"
                :min-date="new Date()"
                @input="dateInput"
                />
            </div>
        </form>

        <form method="dialog" class="modal-backdrop">
            <button>close</button>
        </form>
    </dialog>
</div>
</template>

<style scoped lang="css">
.mycalendar :deep(:is(.vc-time-colon, select.vc-focus.vc-align-right, select.vc-focus.vc-align-left, .vc-align-right option)) {
    color: hsl(var(--bc));
    border-color: hsl(var(--p));
    border-radius: var(--rounded-btn, 0.5rem);
}
.mycalendar :deep(:is(select.vc-focus.vc-align-right option, select.vc-focus.vc-align-left option, select.vc-focus option)) {
    background-color: hsl(var(--b2) / 1);
    border-color: hsl(var(--p));
    border-radius: var(--rounded-btn, 0.5rem);
    color: hsl(var(--p) / 0.8);
}
.mycalendar :deep(:is(.vc-highlight-content-solid)) {
    color: hsl(var(--nc));
    background-color: hsl(var(--p));
}

/* TODO: These buttons are still selectable even when modal isn't loaded yet, leading to screen flicker on hover */
.mycalendar :deep(:is(button.vc-arrow.vc-prev.vc-focus, button.vc-arrow.vc-next.vc-focus)) {
    z-index: 0;
}

.mycalendar :deep(:is(.vc-light, .vc-attr, .vc-light.vc-attr)) {
    --vc-bg: hsl(var(--bc) / 0);
    --vc-border: hsl(var(--p) / 0.25);
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
