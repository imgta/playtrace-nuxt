export default function () {
    const { toast } = useMisc();
    const client = useStrapiClient();
    const { logout, login, register } = useStrapiAuth();
    const { strapi: { url: appHost }, weatherAPI } = useRuntimeConfig().public;
    const expiry = new Date(Date.now() + 86400000); // expiry set to +1 day
    const userCookie: any = useCookie('userCookie', { expires: expiry });
    const { value: token } = computed(() => {
        const token = useStrapiToken().value;
        return token;
    });
    const user = useStrapiUser();
    const myUsername = user.value?.username;

    const { value: myId } = computed(() => {
        if (token) {
            try {
                const { id } = useStrapiUser().value as any;
                return id;
            } catch (error) {
                console.error(error);
            }
        }
    });
    const userData = reactive({
        id: myId,
        username: '',
        fullName: '',
        initials: '',
        avatar: '',
        profileUrl: '',
    }) as Record<string, any>;

    const loginData = reactive({
        username: '',
        password: '',
    }) as Record<string, any>;

    const signupData = reactive({
        fullName: '',
        email: '',
        username: '',
        password: '',
    }) as Record<string, any>;

    const popLogin = ref();
    const popSignup = ref();
    const popRef = reactive({
        switch: '',
        drawer: false,
    }) as Record<string, any>;

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
            const userRes: Record<string, any> = await client(`${appHost}api/users/${userId}?populate=*`, {
                method: 'GET'
            });

            const { username, fullName } = userRes;
            userData.avatar = userRes?.avatar?.formats?.thumbnail?.url;
            userData.username = username;
            userData.fullName = fullName;
            userData.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
            userData.profileUrl = `/${userData.username}`;
        } catch (error) {
            console.error(error);
        } finally {
            userCookie.value = userData;
        }
    }

    async function onDemo() {
        try {
            const loginRes = await login({ identifier: 'demo', password: 'demo123' });
            const newUserId = loginRes.user.value?.id;
            userData.id = newUserId;
        } catch (error) {
            console.error(error);
        } finally {
            navigateTo('/events');
            popModal('close', 'both');
            toast.success('Demo account active!', { timeout: 2000 });
        }
    }

    async function onLogin() {
        if (!loginData.username) {
            toast.error('Username required!', { timeout: 1700 });
            return;
        } else if (!loginData.password) {
            toast.error('Password required!', { timeout: 1700 });
            return;
        }
        try {
            const loginRes = await login({ identifier: loginData.username, password: loginData.password });
            const newUserId = loginRes.user.value?.id;
            userData.id = newUserId;
        } catch (error: any) {
            toast.error((error.error.message as string), { timeout: 2000 });
            console.error(error);
        } finally {
            popModal('close', 'login');
            navigateTo('/events');
            toast.success('User logged in!', { timeout: 2000 });
        }
    }

    async function onRegister() {
        if (!signupData.fullName) {
            toast.error('Full Name required!', { timeout: 1700 });
            return;
        } else if (!signupData.email) {
            toast.error('Email required!', { timeout: 1700 });
            return;
        } else if (!signupData.username) {
            toast.error('Username required!', { timeout: 1700 });
            return;
        } else if (!signupData.password) {
            toast.error('Password required!', { timeout: 1700 });
            return;
        }
        try {
            const signupRes = await register({ username: signupData.username, email: signupData.email, fullName: signupData.fullName, password: signupData.password, });
            const newUserId = signupRes.user.value?.id;
            userData.id = newUserId;
        } catch (error: any) {
            toast.error((error.error.message as string), { timeout: 2000 });
            console.error(error);
        } finally {
            navigateTo('/events');
            popModal('close', 'signup');
            toast.success('User registered!', { timeout: 2000 });
        }
    }

    async function onLogout() {
        try {
            logout();
        } catch (error) {
            console.error(error);
        } finally {
            userData.id = null;
            popRef.drawer = false;
            await navigateTo('/');
            toast.info('User logged out.', { timeout: 1500 });
        }
    }

    return {
        myId,
        token,
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
