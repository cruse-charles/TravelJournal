import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const SinglePage = () => {
    // state vars for page and loading
    const [page, setPage] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // extract page id from url
    const { id } = useParams();

    useEffect(() => {
        // fetch page data and abort request
        const controller = new AbortController();

        // Send cookie containing access_token with request to authenticate user
        axios.get(`/api/page/${id}`, { withCredentials: true, signal: controller.signal })
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
            <div>{page?.title}</div>
            <div>{page?.text}</div>
            {page?.attachments?.map((imageURL, index) => {
                return <img key={index} src={imageURL} />
            })}
        </>
    )
}

export default SinglePage