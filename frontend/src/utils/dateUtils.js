// format date to match with the date format in the database
export const getFormattedDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

// highlight the date of the entry in the calendar
export const getEntryDayProps = (entry, date) => {
    const entryDateObject = new Date(entry.date)
    if (entryDateObject.getTime() === date.getTime()) {
        return { style: { backgroundColor: 'var(--mantine-color-blue-filled)', color: 'var(--mantine-color-white)' } }
    }
    return {};
}

// Setting background color of selected date in calendar after closing modal
export const getSelectedDayProps = (formValues, date) => {
    if (formValues.date !== null && (formValues.date.getTime() === date.getTime())) {
        return { style: { backgroundColor: 'var(--mantine-color-blue-filled)', color: 'var(--mantine-color-white)' } }
    }
    return {};
}

// Excludes dates that are in entryIdHash but not the current entry's date
export const excludeDateFunction = (date, originalEntryDate, entryIdHash) => {
    const formattedDate = getFormattedDate(date);
    const isOriginalEntryDate = formattedDate === getFormattedDate(new Date(originalEntryDate));
    const isDateExcluded = entryIdHash[formattedDate];

    if (isOriginalEntryDate) {
        return false; 
    } else if (isDateExcluded) {
        return true; 
    } else {
        return false
    }
}