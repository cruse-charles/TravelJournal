import React, { useEffect, useRef } from 'react'
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import en from 'air-datepicker/locale/en.js';
import './Calendar.css';

const Calendar = () => {

    const datepickerRef = useRef(null);

    useEffect(() => {
        new AirDatepicker(datepickerRef.current, {
            locale: en,
            onRenderCell({ date, cellType }) {
                let dates = [1, 5, 7, 10, 15, 20, 25],
                    isDay = cellType === 'day',
                    _date = date.getDate(),
                    shouldChangeContent = isDay && dates.includes(_date);

                return {
                    html: shouldChangeContent ? `${_date}<div class="dot"></div>` : undefined,
                    classes: shouldChangeContent ? '-dot-cell-' : undefined,
                    attrs: {
                        title: shouldChangeContent ? 'Special date' : ''
                    }
                }
            }
        })

    }, [])


    return (
        <>
            <div>Calendar</div>
            <div ref={datepickerRef}></div>
        </>
    )
}

export default Calendar