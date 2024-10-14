import { useNavigate } from 'react-router-dom';
import { Text, Stack, Center } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Indicator } from '@mantine/core';

import { getEntryDayProps, getFormattedDate } from '../utils/dateUtils.js';
import useUserEntryDateHash from '../hooks/useUserEntryDateHash.js';

import styles from './Calendar.module.css';
import { Entry } from './types';

type Props = {
    entry: Entry;
    scale: number;
} 

const CalendarViewEntries = ({ scale, entry }: Props) => {

    // Retrieve entryIdHash containing date:id of user's entries from custom hook
    const { entryIdHash } = useUserEntryDateHash();

    const navigate = useNavigate();

    const handleRenderDate = (date: Date) => {
        // Check if date is in hash of entry dates and add indicator if true
        let formattedDate = getFormattedDate(date)
        return !entryIdHash[formattedDate]
    }

    const handleDateClick = (date: Date) => {
        let formattedCalendarDate = getFormattedDate(date);

        // When selecting calendar cell, navigate to entry with matching date in hash
        if (entryIdHash[formattedCalendarDate]) {
            navigate(`/entry/${entryIdHash[formattedCalendarDate]}`);
        }
    }

    // Render calendar with custom day props
    //getDayProps: Adds props to Day component, getEntryDayProps: Highlight the date of the entry in the calendar
    //renderDay: What is rendered in the day cell
    return (
        <Stack className={styles.calendarViewEntries}>
            <Center>
                <Text size='xl' fw={700}>Your Calendar</Text>
            </Center>
            <Calendar
                // style={{ transform: `scale(${scale})`, transformOrigin: 'top right' }}
                size='xl'
                getDayProps={(date) => ({
                    onClick: () => handleDateClick(date),
                    ...getEntryDayProps(entry, date)
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