<!-- <script setup lang="ts">
const { toast } = useMisc();
const name = ref('');
const classes = ref('');
const payOption = ref('');
const venmo = ref('');
const rebootForm = reactive({
    name: '',
    class: '',
    option: '',
    venmo: '',
    terms: '',
});
const submitted = ref<boolean>(false);
// ----------------------------------------------------------------
watchEffect(() => {
    console.log('rebootForm', rebootForm);
});
// ----------------------------------------------------------------
function nameBlur() {
    rebootForm.name = name.value;
}
function classesBlur() {
    rebootForm.class = classes.value;
}
function payOptionBlur() {
    rebootForm.option = payOption.value;
}
function venmoBlur() {
    if (!venmo.value.includes('@') && venmo.value !== '') {
        venmo.value = `@${venmo.value}`;
        rebootForm.venmo = venmo.value;
    } else {
        rebootForm.venmo = venmo.value;
    }
}
function disclaimerCheck() {
    if (rebootForm.terms === '') {
        rebootForm.terms = 'Understood';
    } else if (rebootForm.terms !== '') {
        rebootForm.terms = '';
    }
}

async function submitForm() {
    try {
        const formData = new URLSearchParams();
        formData.append('entry.213845958', rebootForm.name);
        formData.append('entry.1831317388', rebootForm.class);
        formData.append('entry.1648060486', rebootForm.option);
        formData.append('entry.1742914322', rebootForm.venmo);
        formData.append('entry.684427343', rebootForm.terms);

        const formRes = await fetch('https://docs.google.com/forms/d/e/1FAIpQLSf0kkOsmjTEOryO73RCN1NNFDJ9XL5uJ4heBtE598HCuhZ7VQ/formResponse', {
            method: 'POST',
            body: formData,
            // headers: {
            //     'Content-Type': 'application/x-www-form-urlencoded',
            // },
        });
        toast.success('Registration complete!', { timeout: 1400 });
        console.log('formRes', formRes);
        rebootForm.name = '';
        rebootForm.class = '';
        rebootForm.option = '';
        rebootForm.venmo = '';
        rebootForm.terms = '';
        window.location.reload();
    } catch (error) {
        console.error(error);
    } finally {
        submitted.value = true;
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="pb-10">
        <div class="flex items-center justify-center content-center bg-base-200">
            <h1 class="text-primary text-4xl text-center pt-8">
                REBOOT Registration
            </h1>
        </div>
        <div>
            <p class="text-base-content/90 text-center text-sm pt-0.5">
                Please fill out the form.
            </p>
        </div>
    </div>

    <div class="flex justify-center px-6">

        <form
            action="https://docs.google.com/forms/d/e/1FAIpQLSf0kkOsmjTEOryO73RCN1NNFDJ9XL5uJ4heBtE598HCuhZ7VQ/formResponse"
            method="POST">
            <div class="grid grid-rows-4">

                <div class="row-start-1 pb-2">
                    <label class="label p-1">
                        <span class="label-text text-xs">Name?</span>
                    </label>
                    <input v-model="name" name="entry.213845958" type="text" placeholder="Your name"
                        class="input input-bordered input-primary w-full" @blur="nameBlur" />
                </div>

                <div class="row-start-2 flex justify-center pb-2">
                    <div class="w-full">
                        <label class="label p-1">
                            <span class="label-text text-xs">Whose class?</span>
                        </label>
                        <select v-model="classes" class="select select-primary w-full" name="entry.1831317388"
                            @blur="classesBlur">
                            <option selected disabled>Whose class will you be taking?</option>
                            <option>11:30AM Marie Davis $15</option>
                            <option>1:15PM Stella Park $15</option>
                            <option>Both $24 (-20% discount)</option>
                        </select>
                    </div>
                </div>

                <div class="row-start-3 flex justify-center pb-2">
                    <div class="w-full">
                        <label class="label p-1">
                            <span class="label-text text-xs">Payment Option?</span>
                        </label>
                        <select v-model="payOption" class="select select-primary w-full" name="entry.1648060486"
                            @blur="payOptionBlur">
                            <option disabled selected>Payment Option?</option>
                            <option>Venmo</option>
                            <option>Cash</option>
                        </select>
                    </div>
                </div>

                <div v-if="rebootForm.option === 'Venmo'" class="row-start-auto w-full pb-2">
                    <label class="label p-1">
                        <span class="label-text text-xs">Venmo Handle?</span>
                    </label>
                    <input v-model="venmo" name="entry.1742914322" type="text" placeholder="Venmo Handle"
                        class="input input-bordered input-primary w-full" @blur="venmoBlur" />
                </div>

                <div class="row-start-auto form-control w-full py-2">
                    <label class="label cursor-pointer">
                        <span class="label-text pr-2">
                            <span class="font-bold">Terms of Service</span> - By checking, you agree to the following:
                            <br />
                            Attending class you did not sign up/pay for will result in a <span
                                class="font-semibold underline">permanent</span>
                            ban from all future REBOOT workshops.</span>
                        <input type="checkbox" name="entry.684427343"
                            class="checkbox checkbox-lg checkbox-primary self-center" @click="disclaimerCheck" />
                    </label>
                </div>

                <div v-if="rebootForm.option === 'Venmo'" class="row-start-auto flex justify-center pt-2 pb-1">
                    <img
                        src="https://lh3.googleusercontent.com/ghtiHGfFvm6sQYrg0W2uwq0f9TxHBKAVtxYYNWBgCuNiuh97zc7_ffI6F02avgXqo8O_q0fy3j0xVZdNRDUiIvANmoG8L7vCXU8-9OM38X3swRt6Yu7NTZasE8NjX-yxpw=w591" />
                </div>
            </div>

            <div v-if="rebootForm.option === 'Venmo'" class="flex justify-center pb-6">
                <span class="text-primary font-bold">@Christine-Nguyen-66</span>
            </div>

        </form>
    </div>

    <div class="flex items-center justify-center place-content-center pb-8">
        <div v-if="!submitted">
            <button class="event-create " type="submit" @click="submitForm">
                <span>Register</span>
                <svg viewBox="0 0 13 10" class="h-2.5 w-3.5">
                    <path d="M1,5 L11,5"></path>
                    <polyline points="8 1 12 5 8 9"></polyline>
                </svg>
            </button>
        </div>
        <div v-if="submitted">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="fill-primary" viewBox="0 0 256 256">
                <path
                    d="M246.15,65.46l-.07-.07L222.15,41.85a20,20,0,0,0-28.22-.06l-90,88.62L70,97.76a20,20,0,0,0-28.19.1l-24,24a20,20,0,0,0,0,28.26l71.62,72a20,20,0,0,0,28.29,0L246.15,93.74A20,20,0,0,0,246.15,65.46ZM103.61,202.33,37.64,136,56.05,117.6,90,150.24a20,20,0,0,0,28.12,0L208,61.61l18.32,18Z">
                </path>
            </svg>
        </div>
</div>
</template> -->
