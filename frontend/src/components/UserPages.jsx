import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card, Image, Text } from '@mantine/core';

const UserPages = () => {
    const { currentUser } = useSelector(state => state.user)
    const [pages, setPages] = useState([])

    useEffect(() => {

        const controller = new AbortController();

        axios.get(`api/user/pages/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                setPages(res.data)
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])


    return (
        <>
            <div>Your trips</div>
            {pages.map((page) => (
                <Card key={page._id} shadow="sm" padding="lg" radius="md" withBorder >
                    <Card.Section>
                        <Image h={200} src={page.attachments?.[0]} />
                    </Card.Section>
                    <Text fw={500}>{page.title}</Text>
                    <Text truncate='end'>{page.text}</Text>
                </Card>
            ))}
        </>
    )
}

export default UserPages