<script setup lang="ts">
const props = defineProps({
    targetText: {
        type: String,
        default: '',
    }
});
const isHovered = ref(false);
const cyclesPerLetter = 3;
const shuffleTime = 55;
const shuffleChars = '01~-=+_@#$%^&*.,:{};<>?';

const scrambledText = ref(props.targetText);
let intervalRef: ReturnType<typeof setInterval> | null = null;
let pos = 0;

function stopScramble() {
    isHovered.value = false;
    scrambledText.value = props.targetText;
}

function startScramble() {
    isHovered.value = true;
    pos = 0;
    if (intervalRef) {
        clearInterval(intervalRef);
        intervalRef = null;
    }
    scramble();
}

function scramble() {
    intervalRef = setInterval(() => {
        if (!isHovered.value) {
            stopScramble();
            return;
        }
        const scrambled = props.targetText?.split('')
            .map((char, index) => {
                if (index === 0) {
                    return char;
                }
                if (pos / cyclesPerLetter > index) {
                    return char;
                }

                const randomCharIndex = Math.floor(Math.random() * shuffleChars.length);
                const randomChar = shuffleChars[randomCharIndex];

                return randomChar;
            })
            .join('');
        scrambledText.value = scrambled;
        pos++;

        if (pos >= props.targetText.length * cyclesPerLetter) {
            stopScramble();
        }
    }, shuffleTime);
}

watchEffect(() => {
    if (!isHovered.value) {
        stopScramble();
    } else {
        startScramble();
    }
});

onUnmounted(() => {
    stopScramble();
});
</script>

<template>
    <div class="relative text-primary font-normal text-xl normal-case font-mono" @mouseenter="startScramble" @mouseleave="stopScramble">
        <div class="scrambled-text">
            {{ scrambledText }}
        </div>
    </div>
</template>
