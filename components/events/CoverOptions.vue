<script setup lang="ts">
import '@/assets/css/button.css';

const { login } = useStrapiAuth();
const { toast } = useMisc();

const popCover = ref<any | null>(null);
const themeCookie = useCookie('selectedTheme');
const pageTheme = ref(themeCookie).value as any;
const corpoLogin = ref('');

const gifs = ref([]);
const eventGIF = ref('');
const tileClick = ref(false);

// ----------------------------------------------------------------

// ----------------------------------------------------------------
</script>

<template>
<div class="container">
    <div class="radio-tile-group">
        <div class="input-container" :class="tileClick && 'shake'" @click="tileClick = !tileClick">
            <input id="gifs" class="radio-button" type="radio" name="radio">
            <div class="radio-tile">
                <div class="icon gifs-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" class="fill-primary w-20 group-hover:fill-base-content" viewBox="0 0 256 256"><path d="M111.49,52.63a15.8,15.8,0,0,0-26,5.77L33,202.78A15.83,15.83,0,0,0,47.76,224a16,16,0,0,0,5.46-1l144.37-52.5a15.8,15.8,0,0,0,5.78-26Zm-8.33,135.21-35-35,13.16-36.21,58.05,58.05Zm-55,20,14-38.41,24.45,24.45ZM156,168.64,87.36,100l13-35.87,91.43,91.43ZM160,72a37.8,37.8,0,0,1,3.84-15.58C169.14,45.83,179.14,40,192,40c6.7,0,11-2.29,13.65-7.21A22,22,0,0,0,208,23.94,8,8,0,0,1,224,24c0,12.86-8.52,32-32,32-6.7,0-11,2.29-13.65,7.21A22,22,0,0,0,176,72.06,8,8,0,0,1,160,72ZM136,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm101.66,82.34a8,8,0,1,1-11.32,11.31l-16-16a8,8,0,0,1,11.32-11.32Zm4.87-42.75-24,8a8,8,0,0,1-5.06-15.18l24-8a8,8,0,0,1,5.06,15.18Z"></path></svg>
                </div>
                <label for="gifs" class="radio-tile-label">GIFs</label>
            </div>
        </div>

        <div class="input-container">
        <input id="photos" class="radio-button" type="radio" name="radio">
        <div class="radio-tile">
            <div class="icon photos-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="fill-base-content w-20 group-hover:fill-primary" viewBox="0 0 256 256">
                <path d="M216,40H72A16,16,0,0,0,56,56V72H40A16,16,0,0,0,24,88V200a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V184h16a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM72,56H216v62.75l-10.07-10.06a16,16,0,0,0-22.63,0l-20,20-44-44a16,16,0,0,0-22.62,0L72,109.37ZM184,200H40V88H56v80a16,16,0,0,0,16,16H184Zm32-32H72V132l36-36,49.66,49.66a8,8,0,0,0,11.31,0L194.63,120,216,141.38V168ZM160,84a12,12,0,1,1,12,12A12,12,0,0,1,160,84Z"></path>
                </svg>
            </div>
            <label for="photos" class="radio-tile-label">Photos</label>
        </div>
        </div>
    </div>
</div>
</template>

<style lang="css" scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.radio-tile-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.radio-tile-group .input-container {
    position: relative;
    height: 80px;
    width: 80px;
    margin: 0.5rem;
}

.radio-tile-group .input-container .radio-button {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    margin: 0;
    cursor: pointer;
}

.radio-tile-group .input-container .radio-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    border: transparent;
    border-radius: 5px;
    padding: 1rem;
    transition: transform 300ms ease;
}

.radio-tile-group .input-container .icon svg {
    fill: hsl(var(--p) / 1);
    width: 2rem;
    height: 2rem;
}

.radio-tile-group .input-container .radio-tile-label {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: hsl(var(--p) / 1);
}

.radio-tile-group .input-container .radio-button:checked + .radio-tile {
    /* background-color: hsl(var(--p) / 1);
    border: 2px hsl(var(--p) / 1);
    color: white; */
    background-color: transparent;
    border: 2px solid hsl(var(--p) / 1);
    color: hsl(var(--p) / 1);
    transform: scale(1.1, 1.1);
}

.radio-tile-group .input-container .radio-button:checked + .radio-tile .icon svg {
    /* fill: white;
    background-color: hsl(var(--p) / 1); */
    fill: hsl(var(--p) / 1);
    background-color: transparent;
}

.radio-tile-group .input-container .radio-button:checked + .radio-tile .radio-tile-label {
    /* color: white;
    background-color: hsl(var(--p) / 1); */
    color: hsl(var(--p) / 1);
    background-color: transparent;
}

.shake:hover {
    animation: shake 1200ms;
}
@keyframes shake {
    10%,
    30%,
    50%,
    70%,
    90% {
        transform: rotateZ(-5deg);
    }
    20%,
    40%,
    60%,
    80% {
        transform: rotateZ(5deg);
    }
    100% {
        transform: rotateZ(0);
    }
}
</style>
