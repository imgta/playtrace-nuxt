export default function () {
    const { toast } = useMisc();
    const { logout, login, register } = useStrapiAuth();
    const client = useStrapiClient();
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
            const { username, fullName, avatar } = userRes;

            userData.username = username;
            userData.fullName = fullName;
            if (avatar) {
                userData.avatar = avatar?.formats?.thumbnail?.url;
            }
            userData.initials = fullName.split(' ').map((name: any) => name[0].toUpperCase()).join('');
            userData.profileUrl = `/${userData.username}`;
            userCookie.value = userData;
        } catch (error) {
            console.error(error);
        }
    }

    function onDemo() {
        popLogin.value.close();
        popSignup.value.close();
        loginData.username = 'demo';
        loginData.password = 'demo123';
        try {
            onLogin();
        } catch (error) {
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
            userData.id = loginRes.user.value?.id;

            popModal('close', 'login');
            toast.success('User logged in!', { timeout: 1500 });
            setTimeout(() => {
                navigateTo('/events');
            }, 1250);
        } catch (error: any) {
            toast.error((error.error.message as string), { timeout: 2000 });
            console.error(error);
        }
    }

    function isFullName(fullName: string): boolean {
        const bothNames = fullName.split(' ');
        return bothNames.length >= 2;
    }
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
            const signupRes = await register({ username: username, email: email, fullName: fullName, password: password, });
            userData.id = signupRes.user.value?.id;

            // Clear signupData input fields
            Object.keys(signupData).forEach(key => signupData[key] = '');

            popModal('close', 'signup');
            toast.success('User registered!', { timeout: 1500 });
            setTimeout(() => {
                navigateTo('/events');
            }, 1250);
        } catch (error: any) {
            toast.error((error.error.message as string), { timeout: 1500 });
            console.error(error);
        }
    }

    function onLogout() {
        try {
            logout();
            userData.id = null;
            popRef.drawer = false;
            toast.info('User logged out.', { timeout: 1000 });
            setTimeout(() => {
                navigateTo('/');
            }, 1250);
        } catch (error) {
            console.error(error);
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
