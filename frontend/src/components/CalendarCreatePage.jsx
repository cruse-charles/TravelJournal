import React, { useEffect, useRef } from 'react'
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import en from 'air-datepicker/locale/en.js';
import './Calendar.css';

const CalendarCreatePage = () => {

    const datepickerRef = useRef(null);

    useEffect(() => {
        // Create date-picker calendar instance
        const datePicker = new AirDatepicker(datepickerRef.current, {
            // Set language to English
            locale: en,
        })

        // Clean up function to destroy date-picker instance
        return () => {
            datePicker.destroy();
        }
    }, [])


    return (
        <>
            <div>Calendar</div>
            <div ref={datepickerRef}></div>
        </>
    )
}

export default CalendarCreatePage