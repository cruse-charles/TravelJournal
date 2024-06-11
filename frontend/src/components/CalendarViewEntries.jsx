import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { Indicator } from '@mantine/core';
import axios from 'axios';

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

        // SUXIONG - url here might change at some point in the future, and maybe different components use the same file, and so we have to change all these different places. So it is best to create a frontend utils folder with a URLs service
        // SUXIONG - Even put our API calls in this service folder as well, then import this get user function and call it. So put thie whole axios.get(api route) into another file, this way we aren't making tons of callbacks

        // const GetUserEntries = async ()=>{
        //     const controller = new AbortController();
        //     const result = await userEntries()
        //     setEntries(result.data)

        //         // Create hash with dates as keys and entryID as values
        //         for (let entry of result.data) {
        //             let date = new Date(entry.date);
        //             let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

        //             entryIdHash.current[formattedDate] = entry._id;
        //         }
        // }

        // // api/user-entries.ts
        // const userEntries = async ()=>{
        //     return axios.get(`/api/user/entries/${currentUser._id}`, { signal: controller.signal })
        // }



        // SUXIONG - Separate our components from pages, so a page folder will be like userPage, CreatePage, and our components will be the header, footer, navbar, etcc
        // SUXIONG - create a hooks direcotry and do a useGetUserEntries hook, remember all hooks should have 'use' in the beginning and always return something, and when we use them, keep them at the top of the file you're using it in
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
        return !entryIdHash.current[formattedDate]
        // SUXIONG - Don't do return true/false on these, just return the condition
        // if (entryIdHash.current[formattedDate]) {
        //     return false
        // } else {
        //     return true
        // }


        // SUXIONG - get a utils folder and put put this date formatting in there, and import it into this file since we use it twice
    }



    const handleDateClick = (date) => {
        let formattedCalendarDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

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
                // renderDay={(date) => {
                //     const day = date.getDate();
                //     return (
                //         <Indicator size={6} color="blue" offset={-2} disabled={handleRenderDate(date)}>
                //             <div>{day}</div>
                //         </Indicator>
                //     );
                // }}
                // SUXIONG - So above we can change this, date.getDate() isn't really that much so we can just put that date.getDate in our div, and since we are returning just one line at that point, we can get rid of the return statement since it is implicit

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

// can take out export default ..., and just put export at the top beore the export const calendarviewentries, with default it is saying we only export one function and we may want to export more. If we do it this way, we also have to make sure when we import from another file we use the curly brackets, with default tho we can directly import it without the curly brackets