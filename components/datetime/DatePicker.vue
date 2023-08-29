<script setup lang="ts">
import { ref } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const date = ref(new Date());
const ariaLabels = ref({ menu: 'MENU' });

function format(date) {
    const month = date.toLocaleString('default', { month: 'long', });
    const day = date.getDate();
    const weekday = date.toLocaleString('default', { weekday: 'long', });
    const monthDay = `${weekday}, ${month} ${day}`;
    return monthDay;
};
</script>

<template>
    <VueDatePicker v-model="date" :is-24="false" dark time-picker-inline :preview-format="format" select-text="Confirm" placeholder="Select Date" class="form-input placeholder:text-base-content placeholder:text-sm" />
</template>

<style scoped>
/* @import '~/node_modules/@vuepic/vue-datepicker/dist/main.css'; */
/* @tailwind base;
@tailwind components;
@tailwind utilities; */
.dp__theme_light, .dp__theme_light:focus, .dp__theme_dark, .dp__theme_dark:focus {
    --dp-background-color: hsl(var(--bc) / 0) !important;
    --dp-text-color: hsl(var(--bc) / 0.8) !important;
    --dp-primary-text-color: hsl(var(--p) / 0.8) !important;
    --dp-secondary-color: hsl(var(--bc) / 0.8) !important;
    --dp-primary-color: hsl(var(--p) / 1) !important;
    --dp-hover-color: hsl(var(--p) / 0) !important;
    --dp-hover-text-color: hsl(var(--p) / 0.8) !important;
    --dp-hover-icon-color: hsl(var(--p) / 0.8) !important;
    --dp-border-color: hsl(var(--bc)) !important;
    --dp-border-color-hover: hsl(var(--p)) !important;
    --dp-menu-border-color: hsl(var(--bc)) !important;
    --dp-icon-color: hsl(var(--bc) / 0.8) !important;
    --dp-border-radius: var(--rounded-btn, 0.5rem) !important;
    --dp-cell-border-radius: var(--rounded-btn, 0.5rem) !important;
    --dp-highlight-color: none !important;
    --v-calendar-input-bg-color:hsl(var(--bc) / 0);
}
</style>
