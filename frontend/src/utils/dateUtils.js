export const getFormattedDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

export const getDayProps = (entry, date) => {
    const entryDateObject = new Date(entry.date)
    if (entryDateObject.getTime() === date.getTime()) {
        return { style: { backgroundColor: 'var(--mantine-color-blue-filled)', color: 'var(--mantine-color-white)' } }
    }
    return {};
}