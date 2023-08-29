<script setup>
import 'flatpickr/dist/flatpickr.css';
import 'flatpickr/dist/themes/dark.css';
import 'flatpickr/dist/plugins/confirmDate/confirmDate.css';

import flatPickr from 'vue-flatpickr-component';
import confirmDatePlugin from 'flatpickr/dist/plugins/confirmDate/confirmDate.js';

const date = ref(null);

function format(date) {
    const month = date.toLocaleString('default', { month: 'long', });
    const day = date.getDate();
    const weekday = date.toLocaleString('default', { weekday: 'long', });
    const monthDay = `${weekday}, ${month} ${day}`;
    return monthDay;
};

const config = ref({
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    altInput: true,
    altFormat: 'l F j, Y @ h:i K', // Monday August 28, 2023 @ 12:00 PM
    minDate: 'today',
    plugins: [new confirmDatePlugin({
        confirmIcon: '',
        confirmText: 'Confirm',
        showAlways: false,
        theme: 'dark',
    })],
    // time_24hr: true,
});
</script>

<template>
<div>
    <flat-pickr
    v-model="date"
    enable-time="true"
    class="input input-bordered form-input"
    placeholder="Select Date"
    :config="config" />
</div>
</template>

<style scoped>

</style>
