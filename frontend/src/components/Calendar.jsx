import React, { useEffect, useRef } from 'react'
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import en from 'air-datepicker/locale/en.js';

const Calendar = () => {

    const datepickerRef = useRef(null);

    useEffect(() => {
        new AirDatepicker(datepickerRef.current, { inline: true, locale: en })

    }, [])


    return (
        <>
            <div>Calendar</div>
            <div ref={datepickerRef}></div>
        </>
    )
}

export default Calendar