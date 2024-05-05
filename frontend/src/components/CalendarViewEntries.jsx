import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Indicator } from '@mantine/core';
import axios from 'axios';

import { getFormattedDate } from '../utils/dateUtils.js';
import { getUserEntries } from '../utils/apiService.js';

// export const CalendarViewEntries = () => {
const CalendarViewEntries = () => {

    const navigate = useNavigate();

    // Create hash to store entryId with date as key
    const entryIdHash = useRef({});

    // Get current user from redux store and set entries state variable
    const { currentUser } = useSelector(state => state.user)
    const [entries, setEntries] = useState([])

    useEffect(() => {
        const controller = new AbortController();

        getUserEntries(currentUser._id, controller.signal)
            .then(userEntryData => {
                setEntries(userEntryData)

                // Create hash with dates as keys and entryID as values
                for (let entry of userEntryData) {
                    let date = new Date(entry.date);
                    let formattedDate = getFormattedDate(date);

                    entryIdHash.current[formattedDate] = entry._id;
                }
            }).catch(error => {
                console.error(error.response ? error.response.data.message : error.message);
            });

        return () => controller.abort();
    }, [])

    const handleRenderDate = (date) => {
        // Check if date is in hash of entry dates and add indicator if true
        let formattedDate = getFormattedDate(date)
        return !entryIdHash.current[formattedDate]
    }



    const handleDateClick = (date) => {
        let formattedCalendarDate = getFormattedDate(date);

        // When selecting calendar cell, navigate to entry with matching date in hash
        if (entryIdHash?.current[formattedCalendarDate]) {
            navigate(`/entry/${entryIdHash.current[formattedCalendarDate]}`);
        }
    }

    return (

        <div>
            <Text size='xl' fw={700}>Your Calendar</Text>
            <Calendar
                style={{ transform: 'scale(1.3)', transformOrigin: 'top left' }}
                getDayProps={(date) => ({
                    onClick: () => handleDateClick(date),
                })}
                renderDay={(date) =>
                (<Indicator size={6} color="blue" offset={-2} disabled={handleRenderDate(date)}>
                    <div>{date.getDate()}</div>
                </Indicator>)
                }
            />
        </div>

    )
}

export default CalendarViewEntries