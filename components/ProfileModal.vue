<script setup lang="ts">
const client = useStrapiClient();
const { toast } = useMisc();

const { url: appHost } = useRuntimeConfig().public.strapi;
const { id: refId, username: refUsername } = useStrapiUser().value as any;

const imgUrl = ref('');
const file = ref(null);
const imgFile: any = ref(null);
const avatarRes: any = ref(null);
const oldAvatarId: any = ref(null);
// ----------------------------------------------------------------

// ----------------------------------------------------------------
function handleUploadFile() {
    const fileInput: any = file.value;
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        imgFile.value = selectedFile;
        console.log(selectedFile); ;
    }
}
function handleImgUrl() {
    console.log('imgUrl.value', imgUrl.value);
}

async function updateAvatar(event: Event) {
    event.preventDefault();
    try {
        // (1) Find and delete old avatar by id if it exists
        const userRes: Record<string, any> = await client(`${appHost}api/users?populate=deep,2&filters[id][$eq]=${refId}`, {
            method: 'GET',
        });
        console.log('userRes', userRes);
        if (userRes[0].avatar) {
            try {
                oldAvatarId.value = userRes[0].avatar.id;
                const delAvatarRes: any = await client(`${appHost}api/upload/files/${oldAvatarId.value}`, {
                    method: 'DELETE',
                });
                const delResult = await delAvatarRes;
                console.log('delResult', delResult);
            } catch (error) {
                console.error(error);
            } finally {
                toast.info('Old avatar deleted!', { timeout: 1500 });
            }
        }

        // (2a) Handle IMAGE URL
        if (imgUrl.value !== '') {
            try {
                const imgName = `${refUsername}_avatar`;

                // Fetch response is already converted to blob
                const imgRes: any = await $fetch(imgUrl.value);
                console.log('imgRes', imgRes);

                const formData = new FormData();
                formData.append('ref', 'plugin::users-permissions.user');
                formData.append('refId', refId);
                formData.append('field', 'avatar');
                formData.append('files', imgRes, imgName);

                const postRes: Record<string, any> = await client(`${appHost}api/upload`, {
                    method: 'POST',
                    body: formData,
                });

                avatarRes.value = await postRes.data;
                console.log('avatarRes.value', avatarRes.value);
            } catch (error) {
                console.error(error);
            }
        }

        // (2b) Handle IMAGE FILE ATTACHMENT
        if (imgUrl.value === '' && imgFile.value !== null) {
            try {
                const imgName = `${refUsername}_avatar`;

                const formData = new FormData();
                formData.append('ref', 'plugin::users-permissions.user');
                formData.append('refId', refId);
                formData.append('field', 'avatar');
                formData.append('files', imgFile.value, imgName);

                const postRes: Record<string, any> = await client(`${appHost}api/upload`, {
                    method: 'POST',
                    body: formData,
                });
                avatarRes.value = await postRes.data;
                console.log('avatarRes.value', avatarRes.value);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        toast.info('Avatar updated!', { timeout: 1500 });
    }
}
// ----------------------------------------------------------------
</script>

<template>
    <div class="w-full h-full bg-transparent">
        <div class="pb-8">
            <h1 class="text-primary text-4xl text-center pt-4 pb-0.5">
                Change avatar
            </h1>
            <p class="text-neutral-content/80 text-center text-sm">
                With an image URL or file.
            </p>
        </div>

        <div class="grid justify-center pb-3">
            <div class="flex justify-start py-1">
                <input v-model="imgUrl" placeholder="Enter image URL" type="text" class="input input-bordered form-input search h-10"
                    @blur="handleImgUrl" />
            </div>
            <div class="flex justify-start py-1">
                <input ref="file" type="file" accept="image/*"
                    class="file-input file-input-bordered file-input-primary file-input-sm w-full max-w-[15rem] text-xs" @change="handleUploadFile" />
            </div>
            <div class="flex justify-start pt-2">
                <button type="submit" class="btn btn-outline btn-primary btn-wide max-w-[15rem]" @click="updateAvatar">Upload</button>
            </div>
        </div>
    </div>
</template>
