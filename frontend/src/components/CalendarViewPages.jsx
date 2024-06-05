import React, { useEffect, useRef, useState } from 'react'
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import en from 'air-datepicker/locale/en.js';
import './Calendar.css';
import { useSelector } from 'react-redux';
import axios from 'axios';

const CalendarViewPages = () => {

    const datepickerRef = useRef(null);

    const { currentUser } = useSelector(state => state.user)
    const [pages, setPages] = useState([])

    useEffect(() => {

        const controller = new AbortController();

        axios.get(`api/user/pages/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                console.log(pages)
                setPages(res.data)
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])

    useEffect(() => {
        // Create date-picker calendar instance
        const datePicker = new AirDatepicker(datepickerRef.current, {
            // Set language to English
            locale: en,

            // Callback function to analyze each cell of calendar
            onRenderCell({ date, cellType }) {
                if (cellType === 'day') {
                    for (let page of pages) {
                        let pageDate = new Date(page.date);
                        if (date.getDate() === pageDate.getDate() && date.getMonth() === pageDate.getMonth() && date.getFullYear() === pageDate.getFullYear()) {
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



                // OLD
                // let dates = [1, 5, 7, 10, 15, 20, 25],
                //     // check if cell is a day cell and extract day
                //     isDay = cellType === 'day',
                //     _date = date.getDate(),
                //     shouldChangeContent = isDay && dates.includes(_date);

                // return {
                //     // Change content of cell if it is a day cell and date is in dates array
                //     html: shouldChangeContent ? `${_date}<div class="dot"></div>` : undefined,
                //     classes: shouldChangeContent ? '-dot-cell-' : undefined,
                //     attrs: {
                //         title: shouldChangeContent ? 'Special date' : ''
                //     }
                // }
                //OLD
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