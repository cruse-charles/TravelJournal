import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card, Image, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useNavigate } from 'react-router-dom';


const UserPages = () => {
    const { currentUser } = useSelector(state => state.user)
    const navigate = useNavigate();
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

    const handleNavigate = (id) => {
        navigate(`/page/${id}`)
    }


    return (
        <>
            {pages.map((page) => (
                <Carousel.Slide key={page._id}>
                    <Card onClick={() => handleNavigate(page._id)} key={page._id} shadow="sm" padding="lg" radius="md" withBorder style={{ width: 650, height: 500 }}>
                        <Card.Section>
                            <Image h={300} src={page.attachments?.[0]} />
                        </Card.Section>
                        <Text fw={500}>{page.title}</Text>
                        <Text truncate='end'>{page.text}</Text>
                    </Card>
                </Carousel.Slide>
            ))}
        </>
    )
}

export default UserPages