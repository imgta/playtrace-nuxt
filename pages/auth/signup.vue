<script setup lang="ts">
const { register } = useStrapiAuth();
const { toast } = useMisc();

const userData = reactive({
    fullname: '',
    email: '',
    username: '',
    password: '',
});
// ----------------------------------------------------------------
const formValid = computed(() => {
    return !!userData.fullname && !!userData.email && !!userData.username && !!userData.password;
});
// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await register({ username: userData.username, email: userData.email, fullName: userData.fullname, password: userData.password, });
        navigateTo('/');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <div>
        <div class="bg-base-100">
            <h1 class="text-primary text-5xl font-semibold text-center pt-5">
                Join the party!
            </h1>
            <p class="pb-3 pt-1 text-primary/75 text-center">
                Plan. Play. Connect.
            </p>
        </div>

        <div class="hero bg-base-100">
            <div class="hero-content flex-col lg:flex-row-reverse pb-10">
                <div class="card flex-shrink-0 w-full max-w-sm bg-base-200">
                    <div class="card-body pb-4">
                        <span class="text-4xl font-normal text-primary/90 text-center pr-3 pb-4">
                            Register
                        </span>
                        <div>
                            <label class="label-text">Full Name</label>
                            <input v-model="userData.fullname" type="text" name="fullname" required
                                class="form-control input input-bordered text-base-content focus:bg-base-100 focus:text-base-content w-full" />
                        </div>
                        <div>
                            <label class="label-text">Email</label>
                            <input v-model="userData.email" type="email" name="email" required
                                class="form-control input input-bordered text-base-content focus:bg-base-100 focus:text-base-content w-full" />
                        </div>
                        <div>
                            <label class="label-text">Username</label>
                            <input v-model="userData.username" type="text" name="username" required
                                class="form-control input input-bordered text-base-content focus:bg-base-100 focus:text-base-content w-full" />
                        </div>
                        <div>
                            <label class="label-text">Password</label>
                            <input v-model="userData.password" type="password" name="password" required
                                class="form-control input input-bordered text-base-content focus:bg-base-100 focus:text-base-content w-full" />
                        </div>
                        <div class="mt-1 bg-base-200 flex justify-center py-4">
                            <button type="submit" class="btn btn-primary btn-wide text-neutral-content" @click="onSubmit">
                                Register
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
