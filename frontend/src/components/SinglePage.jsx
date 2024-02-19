import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CalendarViewPages from './CalendarViewPages';
import { Image, Title, Flex, Text, Stack, Group } from '@mantine/core';


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
            <Flex>
                {page?.attachments?.map((imageURL, index) => {
                    return <Image key={index} src={imageURL} height={500} />
                })}
                <Title>{page?.title}</Title>
                <Text>{page?.text}</Text>
            </Flex>
            <CalendarViewPages />
        </>
    )
}

export default SinglePage