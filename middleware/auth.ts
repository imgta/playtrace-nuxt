export default defineNuxtRouteMiddleware((to, from) => {
    const strapiJwt = useCookie('strapi_jwt');
    const { toast } = useMisc();
    // this is just a quick solution. Ideally we would check if the jwt is valid here too.
    // TODO: decode JWT token with header for validation
    const token = strapiJwt.value;

    // if (!token && !isLoginPage(to.path)) {
    //     return navigateTo(`/auth/login/?redirect=${to.path}`);
    // }
    if (!token && !isLoginPage(to.path)) {
        toast.error('Please login.', { timeout: 1500 });
        return navigateTo(`/?redirect=${to.path}`);
    }

    if (token && isLoginPage(to.path) && from.query.redirect) {
        toast.error('Please login.', { timeout: 1500 });
        // we just finished logging in and the page was refreshed
        return navigateTo(<string>from.query.redirect);
    }
    toast.error('Please login.', { timeout: 1500 });
});

function isLoginPage(path: string) {
    return path === '/auth/login';
}
