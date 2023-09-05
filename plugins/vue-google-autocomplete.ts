// import VueGoogleAutocomplete from 'vue-google-autocomplete';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use();
    const config = useRuntimeConfig();
    useHead({
        script: [
            {
                src: `https://maps.googleapis.com/maps/api/js?key=${config.public.googleMapsAPI}&libraries=places&callback=initMap`,
                async: true,
            }, {
                src: '/scripts/map-init.js',
                async: true
            }
        ]
    });
});
