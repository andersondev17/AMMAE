export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const formatDateTime = (dateString: Date) => {
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        year: 'numeric', 
        day: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric', 
        hour12: true,
    };

    const formattedDateTime = new Date(dateString).toLocaleString('en-US', dateTimeOptions);
    const formattedDate = new Date(dateString).toLocaleString('en-US', dateOptions);
    const formattedTime = new Date(dateString).toLocaleString('en-US', timeOptions);

    return {
        dateTime: formattedDateTime,
        dateOnly: formattedDate,
        timeOnly: formattedTime,
    };
};
