import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CalendarViewPages from '../../components/CalendarViewPages';
import { Image, Title, Flex, Text, Stack, Group, ScrollArea } from '@mantine/core';
import { Carousel } from '@mantine/carousel';


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
            <Flex align="flex-start">
                <Carousel style={{ width: '75%', height: '560px' }} loop withIndicators>
                    {page?.attachments?.map((imageURL, index) => {
                        return (
                            <Carousel.Slide key={index} style={{ width: '75%', height: '560px' }} >
                                <Image key={index} src={imageURL} />
                            </Carousel.Slide>
                        )
                    })}
                </Carousel>
                <Stack style={{ width: '25%' }}>
                    <Title>{page?.title}</Title>
                    <ScrollArea h={500}>
                        <Text>{page?.text}</Text>
                    </ScrollArea>
                </Stack>
            </Flex>
            {/* <CalendarViewPages /> */}
        </>
    )
}

export default SinglePage