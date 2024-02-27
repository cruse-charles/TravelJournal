import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, FileInput, TextInput, Textarea, SimpleGrid, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getFormattedDate, getEntryDayProps } from '../../utils/dateUtils';
import { getUpdatedFiles } from '../../utils/uploaderHelper';
import { getUserEntry, getUpdatedEntry, deleteEntry } from '../../utils/apiService';
import { updateFormData } from '../../utils/updateFormData';

// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan, FaCalendarDay } from "react-icons/fa6";

// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO - NEED UNIQUE KEYS, IF I DELETE OUT OF ORDER, PICS GET FUCKED UP
// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO - DELETE IMAGES FROM S3
// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO - fix calendar in edit mode

const SingleEntry = () => {
    // state vars for entry and loading
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)
    const [previews, setPreviews] = useState([])
    const { entryIdHash } = useUserEntryDateHash();

    // useDisclosure hook to open and close modal
    const [opened, { open, close }] = useDisclosure(false);

    // extract entry id from url, and navigate function
    const { id } = useParams();
    const navigate = useNavigate();

    // useEffect(() => {
    useEffect(() => {
        // fetch entry data and abort request
        const controller = new AbortController();

        getUserEntry(id, controller.id)
            .then(entryResponse => {
                setEntry(entryResponse);
                setIsLoading(false);
                setPreviews(entryResponse.attachments)
            }).catch(error => {
                console.log(error.response.data.message)
                setIsLoading(false)
            })

        return () => controller.abort();
    }, [id, isEditing])

    useEffect(() => {
        console.log('ENTRY', entry)
        console.log('PREVIEWS', previews ? previews : 'No previews')
    }, [entry, previews])

    // show loading message while request is in progress
    if (isLoading) {
        return <div>Loading...</div>
    }

    // delete entry and navigate to profile page
    const handleDelete = async () => {
        try {
            await deleteEntry(id)
            navigate('/profile')
        } catch (error) {
            console.log(error.response.data.message)
        }
    }


    const startEdit = () => {
        setIsEditing(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEntry({ ...entry, [name]: value })
    }

    const handleImageChange = (newFiles) => {
        console.log('NEW FILES', newFiles)
        const updatedFiles = [...entry.attachments, ...newFiles];
        setPreviews((prevState) => [...prevState, ...newFiles])
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };

    const deleteSelectedImage = (key) => {
        console.log(key)
        const [type, id] = key.split('-')

        const updatedFiles = previews.filter((item) => {
            if (type === 'url') {
                console.log('S3', item)
                return `url-${item}` !== key
            } else {
                console.log('FILE', item.name)
                return `file-${item.name}` !== key
            }
        })

        console.log('updatedFiles', updatedFiles)

        setPreviews(updatedFiles)
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        previews.map(async (item) => {
            console.log('PREVIEW ITEM', item)
        })

        const updatedFiles = await getUpdatedFiles(previews)
        const formData = updateFormData(entry, updatedFiles)
        updateEntry(formData);
    };

    const updateEntry = async (formData) => {
        try {
            const response = await getUpdatedEntry(id, formData)
            setEntry(response.data)
            setIsEditing(false)
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            {!isEditing ? (
                <>
                    <Flex align="flex-start">
                        <Carousel style={{ width: '75%', height: '560px' }} loop withIndicators>
                            {entry?.attachments?.map((imageURL, index) => {
                                return (
                                    <Carousel.Slide key={imageURL} style={{ width: '75%', height: '560px' }} >
                                        <Image key={imageURL} src={imageURL} />
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
                            getDayProps={(date) => getEntryDayProps(entry, date)}
                        />
                    </Modal>
                    <Button onClick={open}><FaCalendarDay />View Calendar</Button>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Flex >
                            <div style={{ width: '60%' }}>
                                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleImageChange} style={{ width: '100%', height: '50%' }}>
                                    <Text ta="center">Drop images here</Text>
                                </Dropzone>
                                <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
                                    {previews.map((item, index) => {
                                        const isFile = item instanceof File;
                                        const src = isFile ? URL.createObjectURL(item) : item;
                                        const key = isFile ? `file-${item.name}` : `url-${item}`;
                                        return (
                                            <Indicator key={key} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(key)}>
                                                <Image key={key} src={src} onLoad={() => URL.revokeObjectURL(src)} />
                                            </Indicator>
                                        )
                                    })}
                                </SimpleGrid>
                            </div>
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
                                onChange={(date) => setEntry({ ...entry, date: date })}
                                getDayProps={(date) => getEntryDayProps(entry, date)}
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