import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Text } from '@mantine/core';
import axios from 'axios';
import AirDatepicker from 'air-datepicker';
import en from 'air-datepicker/locale/en.js';
import 'air-datepicker/air-datepicker.css';
import './Calendar.css';

const CalendarViewPages = () => {

    const navigate = useNavigate();

    // Create ref for date-picker calendar
    const datepickerRef = useRef(null);
    const pageIdHash = useRef({});

    // Get current user from redux store and set pages state variable
    const { currentUser } = useSelector(state => state.user)
    const [pages, setPages] = useState([])

    // Fetch a user's page data
    useEffect(() => {

        const controller = new AbortController();

        // SUXIONG - url here might change at some point in the future, and maybe different components use the same file, and so we have to change all these different places. So it is best to create a frontend utils folder with a URLs service
        // Even put our API calls in this service folder as well, then import this get user function and call it.
        // SUXIONG - Separate our components from pages, so a page folder will be like userPage, CreatePage, and our components will be the header, footer, navbar, etcc
        // 

        axios.get(`/api/user/pages/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                setPages(res.data)

                // Create hash with dates as keys and pageID as values
                for (let page of res.data) {
                    let date = new Date(page.date);
                    let formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

                    pageIdHash.current[formattedDate] = page._id;
                }
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])

    // Create date-picker calendar instance
    useEffect(() => {
        // Create calendar
        const datePicker = new AirDatepicker(datepickerRef.current, {
            // Set language to English
            locale: en,

            // Callback function to analyze each cell of calendar and match with date of each page
            onRenderCell({ date, cellType }) {
                if (cellType === 'day') {
                    for (let page of pages) {
                        let pageDate = new Date(page.date);
                        if (date.getDate() === pageDate.getDate() && date.getMonth() === pageDate.getMonth() && date.getFullYear() === pageDate.getFullYear()) {
                            // Return cell with html and classes for desired styling
                            return {
                                html: `${date.getDate()}<div class="dot"></div>`,
                                classes: '-dot-cell-',
                                attrs: {
                                    title: 'Special date'
                                }
                            }
                        }
                    }
                }
            },
            // When selecting calendar cell, navigate to page with matching date in hash
            onSelect({ date, }) {
                let formattedCalendarDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
                if (pageIdHash.current[formattedCalendarDate]) {
                    navigate(`/page/${pageIdHash.current[formattedCalendarDate]}`);
                }
            }
        })

        // Clean up function to destroy date-picker instance
        return () => {
            datePicker.destroy();
            // console.log('destroy')
        }
    }, [pages])

    return (
        <>
            <div className='CalendarViewPages-container flex flex-col items-center'>
                <Text size='xl' fw={700}>Your Calendar</Text>
                <div ref={datepickerRef}></div>
            </div>
        </>
    )
}

export default CalendarViewPages