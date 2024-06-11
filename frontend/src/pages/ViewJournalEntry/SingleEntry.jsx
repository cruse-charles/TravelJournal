import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CalendarViewEntries from '../../components/CalendarViewEntries';
import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan } from "react-icons/fa6";


const SingleEntry = () => {
    // state vars for entry and loading
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // extract entry id from url
    const { id } = useParams();

    useEffect(() => {
        // fetch entry data and abort request
        const controller = new AbortController();

        // Send request to backend to get entry data
        axios.get(`/api/entry/${id}`, { signal: controller.signal })
            .then(res => {
                setEntry(res.data);
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
                    {entry?.attachments?.map((imageURL, index) => {
                        return (
                            <Carousel.Slide key={index} style={{ width: '75%', height: '560px' }} >
                                <Image key={index} src={imageURL} />
                            </Carousel.Slide>
                        )
                    })}
                </Carousel>
                <Stack style={{ width: '25%' }}>
                    <Group>
                        <Title order={2} style={{ width: '60%' }}>{entry?.title}</Title>
                        <Group gap='xs'>
                            <Button variant="outline" color="gray" size="xs"><FaPencil /></Button>
                            <Button variant="outline" color="gray" size="xs"><FaRegTrashCan /></Button>
                        </Group>
                    </Group>
                    <ScrollArea h={500}>
                        <Text>{entry?.text}</Text>
                    </ScrollArea>
                </Stack>
            </Flex>
            {/* <CalendarViewEntries /> */}
        </>
    )
}

export default SingleEntry