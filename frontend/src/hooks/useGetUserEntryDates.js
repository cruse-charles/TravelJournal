import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';

import { getFormattedDate } from '../utils/dateUtils.js';
import { getUserEntries } from '../utils/apiService.js';

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
