import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import AirDatepicker from 'air-datepicker';
import en from 'air-datepicker/locale/en.js';
import 'air-datepicker/air-datepicker.css';
import './Calendar.css';

const CalendarViewPages = () => {

    // Create ref for date-picker calendar
    const datepickerRef = useRef(null);

    // Get current user from redux store and set pages state variable
    const { currentUser } = useSelector(state => state.user)
    const [pages, setPages] = useState([])

    // Fetch a user's page data
    useEffect(() => {

        const controller = new AbortController();

        axios.get(`api/user/pages/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                setPages(res.data)
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])

    // Create date-picker calendar instance
    useEffect(() => {
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
            }
        })

        // Clean up function to destroy date-picker instance
        return () => {
            datePicker.destroy();
        }
    }, [pages])


    return (
        <>
            <div>CalendarViewPages</div>
            <div ref={datepickerRef}></div>
        </>
    )
}

export default CalendarViewPages