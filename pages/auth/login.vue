<script setup lang="ts">
const { login } = useStrapiAuth();
const { toast } = useMisc();

const userData = reactive({
    username: '',
    password: '',
});
// ----------------------------------------------------------------

// ----------------------------------------------------------------
async function onSubmit() {
    try {
        await login({ identifier: userData.username, password: userData.password });
        navigateTo('/events');
    } catch (e: any) {
        toast.error((e.error.message as string), { timeout: 2000 });
        console.error(e);
    }
};
// ----------------------------------------------------------------
</script>

<template>
    <div>
        <div class="bg-base-100">
            <h1 class="text-primary text-5xl font-semibold text-center pt-5">
                Welcome back!
            </h1>
            <p class="pb-4 pt-1 text-primary/75 text-center">
                Plan. Play. Connect.
            </p>
        </div>
        <div class="hero bg-base-100">
            <div class="hero-content flex-col lg:flex-row-reverse pb-10">
                <div class="card flex-shrink-0 w-full max-w-sm bg-base-200">
                    <div class="card-body">
                        <span class="text-4xl font-normal text-primary/90 text-center pr-3 pb-4">
                            Login
                        </span>
                        <div>
                            <label class="label-text">Username</label>
                            <input v-model="userData.username" type="text" name="username"
                                class="form-control input input-bordered text-base-content focus:bg-base-100 focus:text-base-content w-full" />
                        </div>
                        <div>
                            <label className="label-text">Password</label>
                            <input v-model="userData.password" type="password" name="password"
                                class="form-control input input-bordered text-base-content focus:bg-base-100 focus:text-base-content w-full" />
                            <label class="label mt-0">
                                <NuxtLink to="/" class="link link-hover text-base-content">
                                    <span class="label-text-alt">Forgot password?</span>
                                </NuxtLink>
                            </label>
                        </div>
                        <div className="mt-1 bg-base-200 flex justify-center">
                            <button type="submit" class="btn btn-primary btn-wide text-neutral-content" @click="onSubmit">
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
