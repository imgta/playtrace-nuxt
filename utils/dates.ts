export function formatDays(datetime: string): string {
    const date = new Date(datetime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays === 1 && diffHours >= 24) {
        return 'Yesterday';
    } else if (diffHours < 24) {
        return 'Today';
    } else if (diffDays <= 6) {
        return `${diffDays} days ago`;
    } else if (diffDays <= 29) {
        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        if (remainingDays === 0) {
            return `${weeks} week`;
        } else {
            return `${weeks} weeks, ${remainingDays} days`;
        }
    } else if (diffDays <= 365) {
        const months = Math.floor(diffDays / 30);
        return `${months} months`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `${years} years`;
    }
}

export function dashDate(datetime: string): string {
    const today = new Date();
    const todayMonth = today.toLocaleString('default', {
        month: 'long',
    });
    const todayDay = today.getDate();
    const weekday = today.toLocaleString('default', {
        weekday: 'long',
    });
    const monthDay = `${weekday}, ${todayMonth} ${todayDay}`;
    return monthDay;
}

export function articleDate(datetime: any) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return datetime.toLocaleDateString('en-US', options);
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
        return `${dayLabel} ${shortDayName} • ${hours12(hours)}:${padZero(minutes)}${amOrPm}`;
    } else {
        return `${shortDayName}, ${monthName} ${dateNum} • ${hours12(hours)}:${padZero(minutes)}${amOrPm}`;
    }
}
