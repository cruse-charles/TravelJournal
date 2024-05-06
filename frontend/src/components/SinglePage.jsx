import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { set } from 'mongoose';


const SinglePage = () => {
    const [page, setPage] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const { id } = useParams();


    useEffect(() => {
        const controller = new AbortController();

        axios.get(`/api/page/${id}`, { signal: controller.signal })
            .then(res => {
                setPage(res.data);
                setIsLoading(false);
            }).catch(error => {
                alert(error.message)
                setIsLoading(false)
            })

        return () => controller.abort();
    }, [id])

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