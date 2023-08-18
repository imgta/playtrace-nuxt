// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        // The private keys which are only available within server-side
        // apiSecret: 'this string is only available server side, not client side. you can also put this string in the .env file, which is git ignored. then call it like weatherAppSecret but its config.apiSecret',
        public: { // Keys within public, will be also exposed to the client-side
            // weatherAppSecret: process.env.WEATHER_APP_SECRET, //call this: const config = useRuntimeConfig(); config.public.weatherAppSecret
        },
    },
    build: {
        transpile: ['vue-toastification'],
    },
    // css: ["~/assets/css/global.css"],
    generate: {
        // routes: ['/profile',] //force generate these routes if they aren't crawled
    },
    modules: [
        '@nuxtjs/tailwindcss',
    ],
    nitro: {
        prerender: {
            // routes: ['/sitemap.xml'],
        },
    },
});
