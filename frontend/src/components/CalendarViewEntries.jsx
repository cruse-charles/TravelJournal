import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Text, Stack } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Indicator } from '@mantine/core';

import { getFormattedDate } from '../utils/dateUtils.js';
import useUserEntryDateHash from '../hooks/useUserEntryDateHash.js';

const CalendarViewEntries = () => {

    // Retrieve entryIdHash containing date:id of user's entries from custom hook
    const { entryIdHash } = useUserEntryDateHash();

    const navigate = useNavigate();

    const handleRenderDate = (date) => {
        // Check if date is in hash of entry dates and add indicator if true
        let formattedDate = getFormattedDate(date)
        return !entryIdHash[formattedDate]
    }

    const handleDateClick = (date) => {
        let formattedCalendarDate = getFormattedDate(date);

        // When selecting calendar cell, navigate to entry with matching date in hash
        if (entryIdHash[formattedCalendarDate]) {
            navigate(`/entry/${entryIdHash[formattedCalendarDate]}`);
        }
    }

    return (
        <Stack >
            <Text size='xl' fw={700}>Your Calendar</Text>
            <Calendar
                style={{ transform: 'scale(1.6)', transformOrigin: 'top right' }}
                getDayProps={(date) => ({
                    onClick: () => handleDateClick(date),
                })}
                renderDay={(date) =>
                (<Indicator size={6} color="blue" offset={-2} disabled={handleRenderDate(date)}>
                    <div>{date.getDate()}</div>
                </Indicator>)
                }
            />
        </Stack>
    )
}

export default CalendarViewEntries