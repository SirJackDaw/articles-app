export function getDateTimezone(dateString: string, timezone: number): Date {
    if(!dateString) return null
    const date = new Date(dateString);
    date.setHours(date.getHours() + timezone);
    return date
}