export default function () {
    const { strapi: { url: appHost } } = useRuntimeConfig().public;
    const client = useStrapiClient();
    const profile = reactive({
        id: '',
        username: '',
        fullName: '',
        initials: '',
        avatar: '',
        socials: '',
        wallets: '',
    }) as Record<string, any>;

    const socials: Record<string, string> = reactive({});

    async function userByUsername(username: string) {
        try {
            const userRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$eq]=${username}&populate[0]=avatar&populate[1]=social&populate[3]=wallets`, {
                method: 'GET'
            });
            const result = userRes[0];
            const { id, fullName, username: userUsername, social, wallets } = await result;
            profile.id = id;
            profile.fullName = fullName;
            profile.username = userUsername;
            profile.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
            profile.avatar = result.avatar?.url;
            profile.wallets = wallets;

            profile.socials = social;
            socialSplit();
        } catch (error) {
            console.error(error);
        }
    }

    function socialSplit() {
        for (const link of profile.socials) {
            socials[link.site] = link.url;
        }
    }
    return { userByUsername, profile, socials };
}
