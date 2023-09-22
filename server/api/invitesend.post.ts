export default defineEventHandler(async event => {
    const { brevoMailAPI } = useRuntimeConfig().public;
    // const { inviteEmail } = useBrevo(brevoMailAPI);
    // const { name, toEmail, message } = await readBody(event);
    // if (!name || !toEmail || !message) {
    //     throw createError({ statusCode: 400, statusMessage: 'Missing required fields' });
    // }
    return brevoMailAPI;
    // return inviteEmail('200okteam@gmail.com', toEmail, name, message);
});
