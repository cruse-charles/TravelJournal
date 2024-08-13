import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Card, Image, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useNavigate } from 'react-router-dom';
import Autoplay from 'embla-carousel-autoplay';
import styles from './UserEntries.module.css';

type Entry = {
    _id: string;
    title: string;
    text: string;
    attachments?: string[];
}

type User = {
    _id: string;
    username: string;
}

type RootState = {
    user: {
        currentUser: User | null;
    };
}

const UserEntries: React.FC = () => {
    const { currentUser } = useSelector((state: RootState) => state.user)
    const navigate = useNavigate();
    const [entries, setEntries] = useState<Entry[]>([])
    const [errors, setErrors] = useState(null)
    const autoplay = useRef(Autoplay({ delay: 3000 }))

    useEffect(() => {

        const controller = new AbortController();

        if (currentUser) {
            axios.get(`api/user/entries/${currentUser._id}`, { signal: controller.signal })
                .then(res => {
                    setEntries(res.data)
                }).catch((error) => {
                    setErrors(error.response.data.message)
                })
        }

        return () => controller.abort();
    }, [])

    if (errors) {
        return <Text>{errors}</Text>
    }

    const handleNavigate = (id: string) => {
        navigate(`/entry/${id}`)
    }


    return (
        <Carousel slideGap="md" loop dragFree plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset}>
            {entries.map((entry) => (
                <Carousel.Slide key={entry._id} className={styles.carouselSlide} >
                    <Card onClick={() => handleNavigate(entry._id)} key={entry._id} shadow="sm" padding="lg" radius="md" withBorder >
                        <Card.Section>
                            <Image className={styles.cardImage} h={350} src={entry.attachments?.[0]} />
                        </Card.Section>
                        <Text fw={500} >{entry.title}</Text>
                        <Text truncate='end'>{entry.text}</Text>
                    </Card>
                </Carousel.Slide>
            ))}
        </Carousel>
    )
}

export default UserEntries