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

export function shortDate(datetimeInput: string): string {
    const date = new Date(datetimeInput);
    const currentDate = new Date();

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const padZero = (num: number) => (num < 10 ? `0${num}` : num);
    const getAmPm = (hours: number) => (hours >= 12 ? 'PM' : 'AM');
    const hours12 = (hours: number) => (hours % 12 || 12);

    const dayName = dayNames[date.getUTCDay()];
    const shortDayName = shortDayNames[date.getUTCDay()];
    const monthName = monthNames[date.getUTCMonth()];
    const dateNum = date.getUTCDate();
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const amOrPm = getAmPm(hours);

    const dayDifference = Math.floor((date.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));

    const selectDayIdx = shortDayNames.indexOf(shortDayName);
    const currentDayIdx = shortDayNames.indexOf(shortDayNames[currentDate.getUTCDay()]);

    let dayLabel = '';

    if (dayDifference === 0 && date.getUTCDay() === currentDate.getUTCDay()) {
        dayLabel = 'This';
    } else if (dayDifference > 0 && dayDifference <= 7 - (currentDayIdx - selectDayIdx)) {
        dayLabel = 'Next';
    } else if (dayDifference < 0 && dayDifference > -7 - (currentDayIdx - selectDayIdx)) {
        dayLabel = 'Last';
    }

    if (dayLabel) {
        return `${dayLabel} ${shortDayName} > ${hours12(hours)}:${padZero(minutes)}${amOrPm}`;
    } else {
        return `${shortDayName}, ${monthName} ${dateNum} @ ${hours12(hours)}:${padZero(minutes)}${amOrPm}`;
    }
}

export function articleDate(datetime: any) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return datetime.toLocaleDateString('en-US', options);
}
