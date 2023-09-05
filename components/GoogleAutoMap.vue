<script setup lang="ts">
import VueGoogleAutocomplete from 'vue-google-autocomplete';

const emit = defineEmits(['addressInput']);

// ----------------------------------------------------------------
// onMounted(async () => {
//     const config = useRuntimeConfig();
//     const GOOGLE_API = config.public.googleMapsAPI;
//     try {
//         // Might need to setup &callback= function
//         useHead({
//             script: [
//                 {
//                     async: true,
//                     src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&libraries=places&callback=initMap`
//                 },
//             ],
//         });
//     } catch (error) {
//         console.error(error);
//     }
// });

const userLoc = reactive({
    lat: 0,
    long: 0,
});
const userAddress = ref('');

// ----------------------------------------------------------------

async function locateUser() {
    navigator.geolocation.getCurrentPosition(
        pos => {
            userLoc.lat = pos.coords.latitude;
            userLoc.long = pos.coords.longitude;
        }
    );
}

async function getAddressData(place: any, geometry: any) {
    const { name, formatted_address, types } = await geometry;
    userAddress.value = `${name} ${formatted_address}`;
    emit('addressInput', geometry);
    // userGeometry.value = await geometry;
    // address.venue = await name;
    // address.street = await formatted_address;
    // address.types = await types;
    // userPlace.value = await place;
    // console.log('GEOMETRY:', geometry);
    // console.log('PLACE:', place);
}

// ----------------------------------------------------------------

// ----------------------------------------------------------------
// NOTE: Leave types= attribute empty to search for all available types
</script>

<template>
<div>
    <VueGoogleAutocomplete
        id="map2"
        type="text"
        class="input input-bordered form-input"
        placeholder="Where at?"
        country="us"
        types=""
        @placechanged="getAddressData"
        />
</div>
</template>
