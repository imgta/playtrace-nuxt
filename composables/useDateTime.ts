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
