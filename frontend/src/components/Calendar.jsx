import React, { useEffect, useRef } from 'react'
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import en from 'air-datepicker/locale/en.js';
import './Calendar.css';

const Calendar = () => {

    const datepickerRef = useRef(null);

    useEffect(() => {
        // Create date-picker calendar instance
        const datePicker = new AirDatepicker(datepickerRef.current, {
            // Set language to English
            locale: en,

            // Callback function to analyze each cell of calendar
            onRenderCell({ date, cellType }) {
                let dates = [1, 5, 7, 10, 15, 20, 25],
                    // check if cell is a day cell and extract day
                    isDay = cellType === 'day',
                    _date = date.getDate(),
                    shouldChangeContent = isDay && dates.includes(_date);

                return {
                    // Change content of cell if it is a day cell and date is in dates array
                    html: shouldChangeContent ? `${_date}<div class="dot"></div>` : undefined,
                    classes: shouldChangeContent ? '-dot-cell-' : undefined,
                    attrs: {
                        title: shouldChangeContent ? 'Special date' : ''
                    }
                }
            }
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

export default Calendar