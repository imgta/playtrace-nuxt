//note: you cannot use any server functions while you use nuxt generate because that turns your entire website static
//it only works with nuxt build, and you would need to put in .env in prod: NITRO_PRESET=cloudflare-pages
// that will convert the /server/ files into /functions/ files in cloudflare pages automatically
export default defineEventHandler(async e => {
    if (e.node.req.method !== 'POST') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Only allows POST requests'
        });
    }

    // const { meiliPublicKey } = useRuntimeConfig().public;

    const result = 'hi';
    return {
        result
    };
});
