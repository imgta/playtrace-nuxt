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
        function socialSplit() {
            for (const link of profile.socials) {
                socials[link.site] = link.url;
            }
        }

        try {
            const userRes: Record<string, any> = await client(`${appHost}api/users?filters[username][$eq]=${username}&populate[0]=avatar&populate[1]=social&populate[3]=wallets`, {
                method: 'GET'
            });

            const { id, fullName, username: userUsername, social, wallets } = userRes[0];

            profile.avatar = userRes[0]?.avatar?.url;

            profile.id = id;
            profile.fullName = fullName;
            profile.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
            profile.username = userUsername;
            profile.wallets = wallets;
            profile.socials = social;

            socialSplit();
        } catch (error) {
            console.error(error);
        }
    }

    return { userByUsername, profile, socials };
}
