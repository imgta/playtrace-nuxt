<script setup lang="ts">
const client = useStrapiClient();

const strapiJwt = useCookie('strapi_jwt');
const token = strapiJwt.value;
const myCookie = useCookie('userCookie');
const refId = myCookie.value.id;

const imgUrl = ref('');
const file = ref(null);
const imgFile: any = ref(null);

console.log('token', token);
console.log('refId', refId);

function handleUploadFile() {
    const fileInput: any = file.value;
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        imgFile.value = selectedFile;
        console.log(selectedFile);
        console.log('imgFile.value.name', imgFile.value.name);
    }
}

function handleImgUrl() {
    console.log('imgUrl.value', imgUrl.value);
}

async function updateAvatar(event: Event) {
    event.preventDefault();

    try {
        if (imgUrl.value !== '') {
            const imgRes: any = await (fetch(imgUrl.value));
            if (!imgRes.ok) {
                throw new Error(`Failed to fetch image: ${imgRes.statusText}`);
            }

            const imgName = imgRes.url.match(/\/([^/]+)\.[^.]+$/)[1];

            // Convert fetch response to blob
            const imgBlob = await imgRes.blob();

            const formData = new FormData();
            formData.append('ref', 'plugin::users-permissions.user');
            formData.append('refId', refId);
            formData.append('field', 'avatar');
            formData.append('files', imgBlob, imgName);

            const postRes = await client('http://localhost:1337/api/upload', {
                method: 'POST',
                body: formData,
            });
            console.log(postRes);
        }

        if (imgUrl.value === '' && imgFile.value !== null) {
            const imgName = imgFile.value.name;

            const formData = new FormData();
            formData.append('ref', 'plugin::users-permissions.user');
            formData.append('refId', refId);
            formData.append('field', 'avatar');
            formData.append('files', imgFile.value, imgName);

            const postRes = await client('http://localhost:1337/api/upload', {
                method: 'POST',
                body: formData,
            });
            console.log(postRes);
        }
    } catch (error) {
        console.error(error);
    } finally {
        console.log('Avatar updated!');
    }
}
</script>

<template>
<div class="w-full h-full bg-transparent">
    <div class="pb-8">
        <h1 class="text-primary text-4xl text-center pt-4 pr-1.5 pb-0.5">
            Change avatar.
        </h1>
        <p class="text-neutral-content/80 text-center text-sm">
            Use an image URL or file!
        </p>
    </div>

    <div class="pb-2">
        <input
            v-model="imgUrl"
            placeholder="Enter image URL"
            type="text"
            class="input input-bordered form-input"
            @blur="handleImgUrl"
        />
    </div>
    <div class="pb-2">
        <input
        ref="file"
        type="file"
        accept="image/*"
        class="file-input file-input-bordered file-input-primary form-input"
        @change="handleUploadFile"
    />
    </div>
    <div class="">
        <button type="submit" class="btn btn-outline btn-primary" @click="updateAvatar">Upload</button>
    </div>

</div>
</template>
