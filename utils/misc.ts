// --- general pure functions auto imported throughout entire front end. composables are for reactive/lifecycle stuff

// value can be a string like 'category' or an object like { attribute: 'gender.name', widget: 'menu'}
export function test(myString: string) {
    console.log('test', myString);
    return myString;
}

export function drugPath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M219.26,36.77a57.28,57.28,0,0,0-81,0L36.77,138.26a57.26,57.26,0,0,0,81,81L219.26,117.74A57.33,57.33,0,0,0,219.26,36.77ZM100.78,202.26a33.26,33.26,0,1,1-47-47L96,113l47,47Zm101.5-101.49L160,143,113,96l42.27-42.26a33.26,33.26,0,0,1,47,47Zm-9.77-25.26a12,12,0,0,1,0,17l-24,24a12,12,0,1,1-17-17l24-24A12,12,0,0,1,192.51,75.51Z"></path></svg>';
}
export function nightclubPath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M80,108a12,12,0,0,1-12,12H24a12,12,0,0,1,0-24H68A12,12,0,0,1,80,108ZM68,136H24a12,12,0,0,0,0,24H68a12,12,0,0,0,0-24Zm0,40H24a12,12,0,0,0,0,24H68a12,12,0,0,0,0-24Zm82-40H106a12,12,0,0,0,0,24h44a12,12,0,0,0,0-24Zm0,40H106a12,12,0,0,0,0,24h44a12,12,0,0,0,0-24Zm38-96h44a12,12,0,0,0,0-24H188a12,12,0,0,0,0,24Zm44,16H188a12,12,0,0,0,0,24h44a12,12,0,0,0,0-24Zm0,40H188a12,12,0,0,0,0,24h44a12,12,0,0,0,0-24Zm0,40H188a12,12,0,0,0,0,24h44a12,12,0,0,0,0-24Z"></path></svg>';
}
export function artPath() {
    return '<svg class="stroke-primary fill-none w-8 h-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.0261C2 17.1723 5.86713 21.413 10.8468 21.9863C11.5816 22.0709 12.2938 21.7576 12.8168 21.2333C13.4703 20.5781 13.4703 19.5159 12.8168 18.8607C12.2938 18.3364 11.8674 17.5541 12.2619 16.9268C13.8385 14.4192 22 20.178 22 12.0261C22 6.48884 17.5228 2 12 2C6.47715 2 2 6.48884 2 12.0261Z" stroke-width="1.5" /><circle cx="17.5" cy="11.5" r="0.75" class="stroke-primary" stroke-width="1.5" /><circle cx="6.5" cy="11.5" r="0.75" class="stroke-primary" stroke-width="1.5" /><path d="M10.335 6.99976C10.335 7.41397 9.99917 7.74976 9.58496 7.74976C9.17075 7.74976 8.83496 7.41397 8.83496 6.99976C8.83496 6.58554 9.17075 6.24976 9.58496 6.24976C9.99917 6.24976 10.335 6.58554 10.335 6.99976Z" class="stroke-primary" stroke-width="1.5" /><path d="M15.25 7C15.25 7.41421 14.9142 7.75 14.5 7.75C14.0858 7.75 13.75 7.41421 13.75 7C13.75 6.58579 14.0858 6.25 14.5 6.25C14.9142 6.25 15.25 6.58579 15.25 7Z" class="stroke-primary" stroke-width="1.5" /></svg>';
}
export function restaurantPath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M216,40V224a8,8,0,0,1-16,0V176H152a8,8,0,0,1-8-8,268.75,268.75,0,0,1,7.22-56.88c9.78-40.49,28.32-67.63,53.63-78.47A8,8,0,0,1,216,40Zm-96.11-1.31a8,8,0,1,0-15.78,2.63L111.89,88H88V40a8,8,0,0,0-16,0V88H48.11l7.78-46.68a8,8,0,1,0-15.78-2.63l-8,48A8.17,8.17,0,0,0,32,88a48.07,48.07,0,0,0,40,47.32V224a8,8,0,0,0,16,0V135.32A48.07,48.07,0,0,0,128,88a8.17,8.17,0,0,0-.11-1.31Z"></path></svg>';
}
export function moviePath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M232.28,71.32a12,12,0,0,0-7-3.25,48,48,0,0,0-55.19-31,48,48,0,0,0-84.24,0,48,48,0,0,0-55.19,31A12,12,0,0,0,20.32,82.75L50.87,212.58A19.92,19.92,0,0,0,70.34,228H185.66a19.92,19.92,0,0,0,19.47-15.42L235.68,82.75A12,12,0,0,0,232.28,71.32ZM76,60a23.68,23.68,0,0,1,11.23,2.79,12,12,0,0,0,17.35-8,24,24,0,0,1,46.84,0,12,12,0,0,0,17.35,8A23.68,23.68,0,0,1,180,60a24,24,0,0,1,21.78,13.87l-33.13,9.46L135.43,70.05a19.89,19.89,0,0,0-14.86,0L87.35,83.33,54.22,73.87A24,24,0,0,1,76,60Zm25.13,43.67L128,92.92l26.87,10.75L141.49,204h-27ZM48.36,97.16l28.78,8.22L90.29,204H73.5ZM182.5,204H165.71l13.15-98.62,28.78-8.22Z"></path></svg>';
}
export function carPath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M236,108H213L170.83,65.86A19.86,19.86,0,0,0,156.69,60H48.28a20,20,0,0,0-16.64,8.91L2,113.34A12,12,0,0,0,0,120v48a20,20,0,0,0,20,20H33.5a34,34,0,0,0,65,0h59a34,34,0,0,0,65,0H236a20,20,0,0,0,20-20V128A20,20,0,0,0,236,108ZM50.42,84H155l24,24H34.42ZM66,188a10,10,0,1,1,10-10A10,10,0,0,1,66,188Zm124,0a10,10,0,1,1,10-10A10,10,0,0,1,190,188Zm42-24H221A34,34,0,0,0,159,164H97A34,34,0,0,0,35,164H24V132H232Z"></path></svg>';
}
export function storePath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M236,96a12,12,0,0,0-.44-3.3L221.2,42.51A20.08,20.08,0,0,0,202,28H54A20.08,20.08,0,0,0,34.8,42.51L20.46,92.7A12,12,0,0,0,20,96l0,16a43.94,43.94,0,0,0,16,33.92V208a20,20,0,0,0,20,20H200a20,20,0,0,0,20-20V145.92A43.94,43.94,0,0,0,236,112Zm-24,16a20,20,0,0,1-40,0v-4h40ZM44,112v-4H84v4a20,20,0,0,1-40,0Zm64-4h40v4a20,20,0,0,1-40,0ZM57.05,52H199l9.14,32H47.91ZM196,204H60V155.81c1.32.12,2.65.19,4,.19a43.86,43.86,0,0,0,32-13.85,43.89,43.89,0,0,0,64,0A43.86,43.86,0,0,0,192,156c1.35,0,2.68-.07,4-.19Z"></path></svg>';
}
export function barPath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M243.09,35.41A12,12,0,0,0,232,28H24a12,12,0,0,0-8.48,20.49L116,149v55H88a12,12,0,0,0,0,24h80a12,12,0,0,0,0-24H140V149L240.48,48.49A12,12,0,0,0,243.09,35.41ZM203,52,191,64H65L53,52Zm-75,75L89,88H167Z"></path></svg>';
}
export function cafePath() {
    return '<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 fill-primary" viewBox="0 0 256 256"><path d="M212,76H32A12,12,0,0,0,20,88v48a100.24,100.24,0,0,0,26.73,68H32a12,12,0,0,0,0,24H208a12,12,0,0,0,0-24H193.27a100.75,100.75,0,0,0,20-32A44,44,0,0,0,256,128v-8A44.05,44.05,0,0,0,212,76Zm-16,60a76.27,76.27,0,0,1-42,68H86a76.27,76.27,0,0,1-42-68V100H196Zm36-8a20,20,0,0,1-12.57,18.55A97.17,97.17,0,0,0,220,136V101.68A20,20,0,0,1,232,120ZM68,48V24a12,12,0,0,1,24,0V48a12,12,0,0,1-24,0Zm40,0V24a12,12,0,0,1,24,0V48a12,12,0,0,1-24,0Zm40,0V24a12,12,0,0,1,24,0V48a12,12,0,0,1-24,0Z"></path></svg>';
}

// Tim Sort: hybrid between Insertion & Merge sort algorithms, O(n) => O(nlog(n))
// - better best time-complexity than Merge
// - better worst time-complexity than Insertion
export function timSort(arr: [], key: any) {
    const MIN_MERGE = 32;

    const minRunLength = (n: number) => {
        let r = 0;
        while (n >= MIN_MERGE) {
            r |= (n & 1);
            n >>= 1;
        }
        return n + r;
    };

    const insertionSort = (left: number, right: number) => {
        for (let i = left + 1; i <= right; i++) {
            const temp = arr[i];
            let j = i - 1;
            while (j >= left && key(arr[j]) > key(temp)) {
                arr[j + 1] = arr[j];
                j--;
            }
            arr[j + 1] = temp;
        }
    };

    const mergeSort = (l: number, m: number, r: number) => {
        const len1 = m - l + 1; const len2 = r - m;
        const leftArr = arr.slice(l, m + 1);
        const rightArr = arr.slice(m + 1, r + 1);
        let i = 0;
        let j = 0;
        let k = l;
        while (i < len1 && j < len2) {
            arr[k++] = key(leftArr[i]) <= key(rightArr[j]) ? leftArr[i++] : rightArr[j++];
        }
        while (i < len1) { arr[k++] = leftArr[i++]; }
        while (j < len2) { arr[k++] = rightArr[j++]; }
    };

    const n = arr.length;
    const minRun = minRunLength(MIN_MERGE);

    for (let i = 0; i < n; i += minRun) {
        insertionSort(i, Math.min(i + MIN_MERGE - 1, n - 1));
    }

    for (let size = minRun; size < n; size *= 2) {
        for (let left = 0; left < n; left += 2 * size) {
            const mid = left + size - 1;
            const right = Math.min(left + 2 * size - 1, n - 1);
            if (mid < right) { mergeSort(left, mid, right); }
        }
    }
}
