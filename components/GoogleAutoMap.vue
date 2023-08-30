<script setup lang="ts">
import VueGoogleAutocomplete from 'vue-google-autocomplete';

const config = useRuntimeConfig();
const GOOGLE_API = config.public.googleMapsAPI;
useHead({
    script: [
        {
            async: true,
            src: `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API}&libraries=places`
        },
    ],
});

const userLoc = reactive({
    lat: 0,
    long: 0,
});
const userGeometry = ref('');
const userPlace = ref('');
const address = reactive({
    name: '',
    venue: '',
    street: '',
    types: [],
});

async function locateUser() {
    navigator.geolocation.getCurrentPosition(
        pos => {
            userLoc.lat = pos.coords.latitude;
            userLoc.long = pos.coords.longitude;
        }
    );
}

async function getAddressData(place: any, geometry: any) {
    userGeometry.value = await geometry;
    const { name, formatted_address, types } = await geometry;
    address.venue = await name;
    address.street = await formatted_address;
    address.types = await types;
    address.name = await `${name} ${formatted_address}`;
    userPlace.value = await place;
    console.log('GEOMETRY:', geometry);
    console.log('PLACE:', place);
}

watchEffect(() => {
    console.log('TYPES:', address.types);
    console.log('VENUE:', address.venue);
    console.log('NAME:', address.name);
    console.log('USER LOCATION:', userLoc);
});
// Leave types= attribute empty to search for all available types
</script>

<template>
<VueGoogleAutocomplete
    id="map2"
    ref="address"
    type="text"
    class="input input-bordered form-input"
    placeholder="Where at?"
    country="us"
    types=""
    @focus="locateUser"
    @placechanged="getAddressData"
    />
</template>
