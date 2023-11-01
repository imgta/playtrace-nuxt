<script setup lang="ts">
import draggable from 'vuedraggable';

definePageMeta({
    middleware: ['auth'],
});
const { brevoMailAPI } = useRuntimeConfig().public;
const { inviteEmail } = useBrevo(brevoMailAPI);
const toEmail = 'gphamta@gmail.com';
const fullName = 'Gordon T';
const foods = ref([
    'Burger',
    'Steak',
    'Pizza',
    'Tacos',
]);
// ----------------------------------------------------------------
onMounted(() => {
    // console.log('brevoMailAPI', brevoMailAPI);
});
watchEffect(() => {
    console.log('foods.value', foods.value);
    console.log('foods.value[0]', foods.value[0]);
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------
</script>

<template>
    <h1>Foods List:</h1>
    <draggable v-model="foods" tag="ul" item-key="id">
        <template #item="{ element: food }">
            <li>{{ food }}</li>
        </template>
    </draggable>
</template>
