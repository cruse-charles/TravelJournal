import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, FileInput, TextInput, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';

// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan, FaCalendarDay } from "react-icons/fa6";



const SingleEntry = () => {
    // state vars for entry and loading
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)

    // useDisclosure hook to open and close modal
    const [opened, { open, close }] = useDisclosure(false);

    // extract entry id from url, and navigate function
    const { id } = useParams();
    const navigate = useNavigate();

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

    useEffect(() => {
        console.log(entry)
    }, [entry])

    // show loading message while request is in progress
    if (isLoading) {
        return <div>Loading...</div>
    }

    // delete entry and navigate to profile page
    const handleDelete = () => {
        axios.delete(`/api/entry/${id}`)
            .then(res => {
                console.log('Entry deleted')
                navigate('/profile')
            }).catch(error => {
                console.log(error.response.data.message)
            })
    }

    // highlight the date of the entry in the calendar
    const getDayProps = (date) => {
        const entryDateObject = new Date(entry.date)
        if (entryDateObject.getTime() === date.getTime()) {
            return { style: { backgroundColor: 'var(--mantine-color-blue-filled)', color: 'var(--mantine-color-white)' } }
        }
        return {};
    }

    const startEdit = () => {
        setIsEditing(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEntry({ ...entry, [name]: value })
    }

    const handleImageChange = (files) => {
        setEntry({
            ...entry,
            attachments: Array.from(files),
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.put(`/api/entry/${id}`, entry, { headers: { 'Content-Type': 'multipart/form-data' } })
        setIsEditing(false)
    }

    return (
        <>
            {!isEditing ? (
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
                                    <Button variant="outline" color="gray" size="xs" onClick={startEdit}><FaPencil /></Button>
                                    <Button onClick={handleDelete} variant="outline" color="gray" size="xs"><FaRegTrashCan /></Button>
                                </Group>
                            </Group>
                            <ScrollArea h={500}>
                                <Text>{entry?.text}</Text>
                            </ScrollArea>
                        </Stack>
                    </Flex>
                    <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                        <DatePicker
                            getDayProps={getDayProps}
                        />
                    </Modal>
                    <Button onClick={open}><FaCalendarDay />View Calendar</Button>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Flex >
                            <FileInput placeholder="Upload photos" multiple accept='image/*' clearable onChange={handleImageChange} size="lg" style={{ width: '60%' }} value={entry.attachments} />
                            <Stack style={{ width: '40%' }} gap='xs'>
                                <Group>
                                    <TextInput onChange={handleChange} placeholder='Title of your day!' name='title' radius="xs" size='lg' style={{ width: '80%' }} value={entry.title} />
                                    <Button type='submit'>Save</Button>
                                </Group>
                                <Textarea name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={15} maxRows={15} size='lg' radius="xs" value={entry.text} />
                            </Stack>
                        </Flex>
                        <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                            <DatePicker
                                onChange={(date) => setFormValues({ ...formValues, date: date })}
                                getDayProps={getDayProps}
                                excludeDate={(date) => entryIdHash[getFormattedDate(date)]}
                            />
                        </Modal>
                    </form>
                    <Button onClick={open}><FaCalendarDay />View Calendar</Button>
                </>
            )}
        </>
    )
}

export default SingleEntry