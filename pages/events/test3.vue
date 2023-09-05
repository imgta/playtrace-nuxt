<script setup lang="ts">
const { create, delete: _delete } = useStrapi4();
const client = useStrapiClient();

const strapiJwt = useCookie('strapi_jwt');
const token = strapiJwt.value;
const myCookie = useCookie('userCookie');
const refId = myCookie.value.id;

const imgUrl = ref('');
const file = ref(null);
const imgFile = ref();
const gif = 'https://i.giphy.com/StKiS6x698JAl9d6cx/giphy.gif';
const newImg = 'https://images.immediate.co.uk/production/volatile/sites/3/2023/03/Jujutsu-Kaisen-Cropped-dbe733b.jpg';

console.log('token', token);
console.log('refId', refId);

function handleUploadFile() {
    const fileInput: any = file.value;
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        imgFile.value = selectedFile;
        console.log(selectedFile);
        console.log(imgFile.value);
    }
}

async function updateAvatar(event) {
    event.preventDefault();

    try {
        const imgRes = await (fetch(newImg));
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
    } catch (error) {
        console.error(error);
    }
}

// async function uploadPic() {
//     try {
//         await create('upload/', form);
//     } catch (e: any) {
//         console.error(e);
//     } finally {
//         console.log('Pic uploaded!');
//     }
// }
</script>

<template>
<form>
    <!-- Can be multiple files -->
    <!-- <input
        ref="imgUrl"
        placeholder="Enter image URL"
        type="text"
        class="input input-bordered form-input"
        @input="handleImgUrl"
    />
    <input
        ref="file"
        type="file"
        accept="image/*"
        class="input input-bordered form-input"
        @change="handleUploadFile"
    /> -->
    <button type="submit" class="btn btn-primary" @click="updateAvatar">Submit</button>
</form>
</template>
