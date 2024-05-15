import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card, Image, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useNavigate } from 'react-router-dom';


const UserEntries = () => {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
    const [entries, setEntries] = useState([])

    useEffect(() => {

        const controller = new AbortController();

        axios.get(`api/user/entries/${currentUser._id}`, { signal: controller.signal })
            .then(res => {
                setEntries(res.data)
            }).catch((error) => {
                console.log(error.response.data.message)
            })

        return () => controller.abort();
    }, [])

    const handleNavigate = (id) => {
        navigate(`/entry/${id}`)
    }


    return (
        <>
            {entries.map((entry) => (
                <Carousel.Slide key={entry._id}>
                    <Card onClick={() => handleNavigate(entry._id)} key={entry._id} shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650, height: 500 }}>
                        <Card.Section>
                            <Image h={300} src={entry.attachments?.[0]} />
                        </Card.Section>
                        <Text fw={500}>{entry.title}</Text>
                        <Text truncate='end'>{entry.text}</Text>
                    </Card>
                </Carousel.Slide>
            ))}
        </>
    )
}

export default UserEntries