export default defineNuxtPlugin(nuxtApp => {
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
