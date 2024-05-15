import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Indicator } from '@mantine/core';
import axios from 'axios';

const CalendarViewEntries = () => {

    const navigate = useNavigate();

    // Create hash to store entryId with date as key
    const entryIdHash = useRef({});

    // Get current user from redux store and set entries state variable
    const { currentUser } = useSelector(state => state.user)
    const [entries, setEntries] = useState([])

    useEffect(() => {

        const controller = new AbortController();

        // SUXIONG - url here might change at some point in the future, and maybe different components use the same file, and so we have to change all these different places. So it is best to create a frontend utils folder with a URLs service
        // Even put our API calls in this service folder as well, then import this get user function and call it.
        // SUXIONG - Separate our components from pages, so a page folder will be like userPage, CreatePage, and our components will be the header, footer, navbar, etcc
        // 
        axios.get(`/api/user/entries/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                setEntries(res.data)

                // Create hash with dates as keys and entryID as values
                for (let entry of res.data) {
                    let date = new Date(entry.date);
                    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

                    entryIdHash.current[formattedDate] = entry._id;
                }
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])

    const handleRenderDate = (date) => {
        // Check if date is in hash of entry dates and add indicator if true
        let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        if (entryIdHash.current[formattedDate]) {
            return false
        } else {
            return true
        }
    }

    const handleDateClick = (date) => {
        let formattedCalendarDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        // When selecting calendar cell, navigate to entry with matching date in hash
        if (entryIdHash.current[formattedCalendarDate]) {
            navigate(`/entry/${entryIdHash.current[formattedCalendarDate]}`);
        }
    }

    return (
        <>
            <div>
                <Text size='xl' fw={700}>Your Calendar</Text>
                <Calendar style={{ transform: 'scale(1.3)', transformOrigin: 'top left' }} getDayProps={(date) => ({
                    onClick: () => handleDateClick(date),
                })}
                    renderDay={(date) => {
                        const day = date.getDate();
                        return (
                            <Indicator size={6} color="blue" offset={-2} disabled={handleRenderDate(date)}>
                                <div>{day}</div>
                            </Indicator>
                        );
                    }}
                />
            </div>
        </>
    )
}

export default CalendarViewEntries