import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { getFormattedDate } from '../utils/dateUtils.js';
import { getUserEntries } from '../utils/apiService';

// const entryIdHash = useRef({});
const useUserEntryDateHash = () => {
    // Get current user from redux store and set entries state variable
    const { currentUser } = useSelector(state => state.user)
    const [entryIdHash, setEntryIdHash] = useState({});

    useEffect(() => {
        const controller = new AbortController();

        getUserEntries(currentUser._id, controller.signal)
            .then(userEntryData => {
                const hash = {}

                // Create hash with dates as keys and entryID as values
                for (let entry of userEntryData) {
                    let date = new Date(entry.date);
                    let formattedDate = getFormattedDate(date);

                    hash[formattedDate] = entry._id;
                }
                setEntryIdHash(hash);
            }).catch(error => {
                console.log(error.response ? error.response.data.message : error.message);
            });

        return () => controller.abort();
    }, [])

    return { entryIdHash }
}

export default useUserEntryDateHash;