import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, TextInput, Textarea, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getEntryDayProps, excludeDateFunction } from '../../utils/dateUtils';
import { deleteSelectedFiles, getUpdatedFiles } from '../../utils/uploaderHelper';
import { getUserEntry, getUpdatedEntry, deleteEntry } from '../../utils/apiService';
import { updateFormData } from '../../utils/updateFormData';

// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan, FaCalendarDay } from "react-icons/fa6";
import placeholderImage from '../../assets/DropzonePlaceholder.svg'

const SingleEntry = () => {
    // state vars for entry, loading, and previews
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)
    const [previews, setPreviews] = useState([]);
    const [originalEntryDate, setOriginalEntryDate] = useState(null);
    const [errors, setErrors] = useState({})
    const { entryIdHash } = useUserEntryDateHash();
    const autoplay = useRef(Autoplay({ delay: 4000 }))

    // useDisclosure hook to open and close modal
    const [opened, { open, close }] = useDisclosure(false);

    // extract entry id from url, and navigate function
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        // fetch entry data and set entry and previews state vars
        const controller = new AbortController();

        getUserEntry(id, controller.id)
            .then(entryResponse => {
                setEntry(entryResponse);
                setOriginalEntryDate(entryResponse.date);
                setIsLoading(false);
                setPreviews(entryResponse.attachments)
            }).catch(error => {
                setErrors({ message: error.response.data.message })
                setIsLoading(false)
            })

        return () => controller.abort();
    }, [id, isEditing])

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
            setErrors({ message: error.response.data.message })
        }
    }

    const startEdit = () => {
        setIsEditing(true)
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEntry({ ...entry, [name]: value })
        setErrors({})
    }

    // add new images to entry and previews
    const handleImageChange = (newFiles) => {
        const updatedFiles = [...entry.attachments, ...newFiles];
        setPreviews((prevState) => [...prevState, ...newFiles])
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };

    // delete preview image from preview and entry
    const deleteSelectedImage = (key) => {
        const updatedFiles = deleteSelectedFiles(previews, key)

        setPreviews(updatedFiles)
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (entry.title === '') {
            setErrors((prevErrors) => ({ ...prevErrors, title: 'Title is required' }));
            return
        }

        if (entry.text === '') {
            setErrors((prevErrors) => ({ ...prevErrors, text: 'Text is required' }));
            return
        }

        // evaluate if the file is a URL or a file object, then add to formData
        const updatedFiles = await getUpdatedFiles(previews)
        const formData = updateFormData(entry, updatedFiles)
        updateEntry(formData);
    };

    // update entry with new data and set isEditing to false
    const updateEntry = async (formData) => {
        try {
            const response = await getUpdatedEntry(id, formData)
            setEntry(response.data)
            setIsEditing(false)
        } catch (error) {
            setErrors({ message: error.response.data.message })
        }
    }

    return (
        <>
            {!isEditing ? (
                <>
                    <Flex style={{ height: '80vh' }}>
                        <Carousel plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset} style={{ width: '70%' }} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                            {entry?.attachments?.map((imageURL, index) => {
                                return (
                                    <Carousel.Slide key={imageURL} >
                                        <Image key={imageURL} src={imageURL} />
                                    </Carousel.Slide>
                                )
                            })}
                        </Carousel>
                        <Stack style={{ width: '30%', padding: '0px 10px', height: '100%' }}>
                            <Group gap='xl' style={{ pading: '25px', display: 'flex' }} justify='space-between'>
                                <Title order={2} style={{ width: '60%' }}>{entry?.title}</Title>
                                <Group gap='xs' style={{ width: '25%' }}>
                                    <Button variant="outline" color="black" size="xs" onClick={startEdit}><FaPencil /></Button>
                                    <Button onClick={handleDelete} variant="outline" color="black" size="xs"><FaRegTrashCan /></Button>
                                </Group>
                            </Group>
                            <ScrollArea.Autosize>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{entry?.text}</Text>
                            </ScrollArea.Autosize>
                        </Stack>
                    </Flex>
                    <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                        <DatePicker
                            getDayProps={(date) => getEntryDayProps(entry, date)}
                        />
                    </Modal>
                    <Flex justify='flex-end' >
                        <Button color="black" onClick={open}><FaCalendarDay />View Calendar</Button>
                    </Flex>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Flex style={{ height: '80vh' }}>
                            <Carousel style={{ width: '70%' }} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                                {previews.map((item, index) => {
                                    const isFile = item instanceof File;
                                    const src = isFile ? URL.createObjectURL(item) : item;
                                    const key = isFile ? `file-${item.name}` : `url-${item}`;
                                    return (
                                        <Carousel.Slide key={key} >
                                            <Indicator size={15} color="red" label='X' offset={12} style={{ cursor: 'pointer' }} onClick={() => deleteSelectedImage(key)}>
                                            </Indicator>
                                            <Image key={key} src={src} onLoad={() => URL.revokeObjectURL(src)} style={{ fit: 'contain' }} />
                                        </Carousel.Slide>
                                    )
                                })}
                                <Carousel.Slide>
                                    <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleImageChange} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0px' }}>
                                        <Image src={placeholderImage} />
                                    </Dropzone>
                                </Carousel.Slide>
                            </Carousel>
                            <Stack style={{ width: '30%', padding: '0px 10px', height: '100%' }}>
                                <Group>
                                    <TextInput error={errors.title} onChange={handleChange} placeholder='Title of your day!' name='title' radius="xs" size='lg' style={{ width: '70%' }} value={entry.title} maxLength={40} />
                                    <Button type='submit' color="black">Save</Button>
                                </Group>
                                <Textarea error={errors.text} name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={15} maxRows={15} size='lg' radius="xs" value={entry.text} />
                            </Stack>
                        </Flex>
                        <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                            <DatePicker
                                onChange={(date) => setEntry({ ...entry, date: date })}
                                getDayProps={(date) => getEntryDayProps(entry, date)}
                                excludeDate={(date) => excludeDateFunction(date, originalEntryDate, entryIdHash)}
                            />
                        </Modal>
                    </form>
                    <Flex justify='flex-end' >
                        <Stack>
                            <Button color="black" onClick={open}><FaCalendarDay />View Calendar</Button>
                            <Text color='red' error={errors.message}></Text>
                        </Stack>
                    </Flex>
                </>
            )}
        </>
    )
}

export default SingleEntry