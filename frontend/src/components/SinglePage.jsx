import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CalendarViewPages from './CalendarViewPages';

const SinglePage = () => {
    // state vars for page and loading
    const [page, setPage] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // extract page id from url
    const { id } = useParams();

    useEffect(() => {
        // fetch page data and abort request
        const controller = new AbortController();

        // Send request to backend to get page data
        axios.get(`/api/page/${id}`, { signal: controller.signal })
            .then(res => {
                setPage(res.data);
                setIsLoading(false);
            }).catch(error => {
                console.log(error.response.data.message)
                setIsLoading(false)
            })

        return () => controller.abort();
    }, [id])

    // show loading message while request is in progress
    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className='singlepage-container flex'>
                <div className='calendar-container border-2 border-blue-500 w-1/4 flex justify-center pt-10'>
                    <CalendarViewPages />
                </div>
                <div className='page-container flex-1'>
                    <div className='title-container border-2 border-green-500 flex justify-center p-2'>
                        <div className='font-bold text-4xl'>{page?.title}</div>
                    </div>
                    <div className='attachments-container border-2 border-yellow-500 flex justify-center flex-wrap gap-4'>
                        {page?.attachments?.map((imageURL, index) => {
                            return <img key={index} src={imageURL} className='w-[300px] h-[150px]' />
                        })}
                    </div>
                    <div className='text-container border-2 border-red-500 flex justify-center relative p-10'>
                        <div>{page?.text}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SinglePage