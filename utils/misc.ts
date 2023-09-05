// --- general pure functions auto imported throughout entire front end. composables are for reactive/lifecycle stuff

// value can be a string like 'category' or an object like { attribute: 'gender.name', widget: 'menu'}
export function test(myString: string) {
    return myString;
}

export function cardDate(datetimeInput: string): string {
    const date = new Date(datetimeInput);

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const padZero = (num: number) => (num < 10 ? `0${num}` : num);
    const getAmPm = (hours: number) => (hours >= 12 ? 'PM' : 'AM');
    const hours12 = (hours: number) => (hours % 12 || 12);

    const dayName = dayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];
    const dateNum = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const amOrPm = getAmPm(hours);

    const formattedDate = `${dayName}, ${monthName} ${dateNum} @ ${hours12(hours)}:${padZero(minutes)} ${amOrPm}`;

    return formattedDate;
}
