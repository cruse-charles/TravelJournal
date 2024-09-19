import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

import { getFormattedDate } from '../utils/dateUtils.js';
import { getUserEntries } from '../utils/apiService.js';

import { RootState } from '../pages/Entry/types.js';

type EntryIdHash = {
    [key: string]: string;
}

const useUserEntryDateHash = () => {
    // Get current user from redux store and set entries state variable
    const { currentUser } = useSelector((state: RootState) => state.user)
    const [entryIdHash, setEntryIdHash] = useState<EntryIdHash>({});

    useEffect(() => {
        const controller = new AbortController();

        // Fetch user entries and create hash with dates as keys and entryIDs as values, {date: id}
        getUserEntries(currentUser._id, controller.signal)
            .then(userEntryData => {
                const hash: EntryIdHash = {}

                for (let entry of userEntryData) {
                    let date = new Date(entry.date);
                    // Format date as YYYY-MM-DD
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