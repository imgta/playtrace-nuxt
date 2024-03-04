import type { StrapiUser } from '@nuxtjs/strapi/dist/runtime/types';

export default function () {
    const { toast } = useMisc();
    const { logout, login, register } = useStrapiAuth();
    const client = useStrapiClient();
    const token = useStrapiToken();
    const { url: appHost } = useRuntimeConfig().public.strapi;

    const expiry = new Date(Date.now() + 86400000); // expiry set to +1 day
    const userCookie = useCookie('userCookie', { expires: expiry }) as Record<string, any>;

    const user = useStrapiUser() as Ref<StrapiUser>;
    const myId = computed(() => { return user?.value?.id as number | undefined; }).value;
    const myUsername = computed(() => { return user?.value?.username; }).value;

    const isAuth = ref<boolean>(false);
    const userData = reactive({
        id: myId,
        username: '',
        fullName: '',
        initials: '',
        avatar: '',
        profileUrl: '',
    });

    const loginData = reactive({
        username: '',
        password: '',
    });

    const signupData = reactive({
        fullName: '',
        email: '',
        username: '',
        password: '',
    });

    const popLogin = ref();
    const popSignup = ref();
    const popRef = reactive({
        switch: '',
        drawer: false,
    });

    function popModal(action: 'open' | 'close', form: 'login' | 'signup' | 'both') {
        if (action === 'open') {
            if (form === 'login') {
                popLogin.value.showModal();
                popSignup.value.close();
            } else if (form === 'signup') {
                popSignup.value.showModal();
                loginData.username = '';
                loginData.password = '';
                popLogin.value.close();
            }
        } else if (action === 'close') {
            if (form === 'login') {
                loginData.username = '';
                loginData.password = '';
                popLogin.value.close();
            } else if (form === 'signup') {
                popSignup.value.close();
            } else if (form === 'both') {
                loginData.username = '';
                loginData.password = '';
                popLogin.value.close();
                popSignup.value.close();
            }
        }
    }

    async function getUser(userId: number) {
        try {
            const userRes = await client(`${appHost}api/users/${userId}?populate=*`, { method: 'GET' }) as Record<string, any>;
            const { username, fullName, avatar } = userRes;

            userData.username = username;
            userData.fullName = fullName;
            if (avatar) {
                userData.avatar = avatar?.formats?.thumbnail?.url;
            }
            userData.initials = fullName.split(' ').map((name: string) => name[0].toUpperCase()).join('');
            userData.profileUrl = `/${userData.username}`;
            userCookie.value = userData;
            isAuth.value = true;
        } catch (error) {
            console.error(error);
        }
    }

    async function onDemo() {
        popLogin.value.close();
        popSignup.value.close();
        loginData.username = 'demo';
        loginData.password = 'demo123';
        try { await onLogin(); } catch (error) {
            console.error(error);
        }
    }

    async function onLogin() {
        const validLogin = [
            { condition: !loginData.username, message: 'Username required!' },
            { condition: !loginData.password, message: 'Password required!' },
        ];
        for (const valid of validLogin) {
            if (valid.condition) {
                toast.error(valid.message, { timeout: 1700 });
                return;
            }
        }

        const { username, password } = loginData;
        try {
            const loginRes = await login({ identifier: username, password: password });
            userData.id = loginRes.user?.value?.id;

            popModal('close', 'login');
            await getUser(userData.id as number);
            await navigateTo('/events');
            toast.success('User logged in!', { timeout: 1500 });
        } catch (error: any) {
            toast.error((error.error.message as string), { timeout: 1750 });
            console.error(error);
        }
    }

    function isFullName(fullName: string): boolean { return fullName.split(' ').length >= 2; }
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async function onRegister() {
        const validRegister = [
            { condition: !signupData.fullName, message: 'Full Name required!' },
            { condition: !isFullName(signupData.fullName), message: 'First and last name required!' },
            { condition: !signupData.email, message: 'Email required!' },
            { condition: !isValidEmail(signupData.email), message: 'Invalid email format!' },
            { condition: !signupData.username, message: 'Username required!' },
            { condition: !signupData.password, message: 'Password required!' }
        ];
        for (const valid of validRegister) {
            if (valid.condition) {
                toast.error(valid.message, { timeout: 1700 });
                return;
            }
        }

        const { fullName, email, username, password } = signupData;
        try {
            const signupRes = await register({ username, email, fullName, password });
            userData.id = signupRes.user?.value?.id as number;

            await getUser(userData.id as number);
            popModal('close', 'signup');
            // Clear signupData input fields
            Object.keys(signupData).forEach((key: string) => signupData[key as keyof typeof signupData] = '');
            await navigateTo('/events');
            toast.success('User registered!', { timeout: 1500 });
        } catch (error: any) {
            toast.error((error.error.message as string), { timeout: 1500 });
            console.error(error);
        }
    }

    async function onLogout() {
        try {
            logout();

            userData.id = undefined;
            isAuth.value = false;
            popRef.drawer = false;
            await navigateTo('/');
            toast.info('User logged out.', { timeout: 1000 });
        } catch (error) {
            console.error(error);
        }
    }

    return {
        isAuth,
        user,
        myId,
        appHost,
        client,
        userData,
        myUsername,
        loginData,
        signupData,
        popLogin,
        popSignup,
        popRef,
        popModal,
        getUser,
        onDemo,
        onLogin,
        onRegister,
        onLogout,
    };
}
