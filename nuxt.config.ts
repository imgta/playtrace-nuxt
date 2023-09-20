// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    runtimeConfig: {
        // The private keys which are only available within server-side
        // apiSecret: 'this string is only available server side, not client side. you can also put this string in the .env file, which is git ignored. then call it like weatherAppSecret but its config.apiSecret',
        public: {
            unSplashAPI: process.env.UNSPLASH_KEY,
            giphyAPI: process.env.GIPHY_KEY,
            weatherAPI: process.env.WEATHER_API_KEY,
            googleMapsAPI: process.env.GOOGLE_KEY,
            // strapiHost: process.env.STRAPI_URL,
            // Keys within public, will be also exposed to the client-side
            // weatherAppSecret: process.env.WEATHER_APP_SECRET, //call this: const config = useRuntimeConfig(); config.public.weatherAppSecret
        },
        // googleMapsAPI: process.env.GOOGLE_KEY,
    },
    build: {
        transpile: ['vue-toastification', 'v-calendar', '@yeger/vue-masonry-wall'],
    },
    css: ['@/assets/css/global.css', '@/assets/css/fonts.css', '@/assets/css/input.css', '@/assets/css/button.css', '@/assets/css/attach.css', '@/assets/css/bubbles.css', '@/assets/css/dashboard.css'],
    generate: {
        // routes: ['/profile',] //force generate these routes if they aren't crawled
    },
    modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxtjs/strapi'],
    strapi: {
        url: process.env.STRAPI_URL || 'http://localhost:1337/',
        prefix: 'api',
        version: 'v4',
        cookie: { maxAge: 604800 } // 7 days
        // cookieName: 'strapi_jwt'
    },
    colorMode: {
        preference: 'system', // default theme
        dataValue: 'theme', // activate 'data-theme' attribute on <html> tag
        classSuffix: '',
    },
    nitro: {
        prerender: {
            // routes: ['/sitemap.xml'],
        },
    },
    app: {
        head: {
            script: [
                { src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_KEY}&libraries=places` }
            ]
        },
    },
    // routeRules: {
    // }
});
