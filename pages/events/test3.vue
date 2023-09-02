<script setup lang="ts">
const { create } = useStrapi4();

const imgUrl = ref('');
const file = ref(null);
const form = new FormData();
const gif = 'https://i.giphy.com/StKiS6x698JAl9d6cx/giphy.gif';

function handleImgUrl() {
    imgUrl.value = gif;
    form.append('cover', imgUrl.value);
}

function handleUploadFile() {
    const fileInput: any = file.value;
    if (fileInput.files.length > 0) {
        const selectedFile = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', selectedFile);
    }
}
async function uploadPic() {
    try {
        await create('upload', form);
    } catch (e: any) {
        console.error(e);
    } finally {
        console.log('Pic uploaded!');
    }
}
</script>

<template>
<form>
    <!-- Can be multiple files -->
    <input
        v-model="imgUrl"
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
    />
    <button type="submit" class="btn btn-primary" @click="uploadPic">Submit</button>
</form>
</template>
