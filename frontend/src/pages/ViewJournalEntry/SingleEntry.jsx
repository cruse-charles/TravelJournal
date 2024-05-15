import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, FileInput, TextInput, Textarea, SimpleGrid, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

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
    const [files, setFiles] = useState([])
    const [attchmentUrls, setAttachmentUrls] = useState([])

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
        setAttachmentUrls(entry.attachments || [])
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setEntry({ ...entry, [name]: value })
    }

    const handleImageChange = (newFiles) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles)
        setEntry({
            ...entry,
            // attachments: Array.from(files),
            attachments: updatedFiles,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.put(`/api/entry/${id}`, entry, { headers: { 'Content-Type': 'multipart/form-data' } })
        setIsEditing(false)
    }

    const previews = [
        ...files.map((file, index) => {
            const imageUrl = URL.createObjectURL(file);
            return (
                <Indicator key={`file-${index}`} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(index, 'file')}>
                    <Image key={imageUrl} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
                </Indicator>
            );
        }),
        ...attchmentUrls.map((url, index) => {
            return (
                <Indicator key={`s3-${index}`} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(index, 's3')}>
                    <Image key={url} src={url} />
                </Indicator>
            );
        })]

    const deleteSelectedImage = (index, type) => {
        if (type === 'file') {
            const updatedFiles = files.filter((_, fileIndex) => fileIndex !== index);
            setFiles(updatedFiles);
            // Update entry.attachments with the remaining files and S3 URLs
            updateEntryAttachments(updatedFiles, attchmentUrls);
        } else if (type === 's3') {
            const updatedUrls = attchmentUrls.filter((_, urlIndex) => urlIndex !== index);
            setAttachmentUrls(updatedUrls);
            // Update entry.attachments with the remaining files and S3 URLs
            updateEntryAttachments(files, updatedUrls);
        }
    };

    const updateEntryAttachments = (updatedFiles, updatedUrls) => {
        // For local files not yet uploaded, you might store just a reference or identifier
        // This example assumes you have identifiers or a way to reference the files
        const fileReferences = updatedFiles.map(file => file.name); // Using file names as a placeholder

        const allAttachments = [...fileReferences, ...updatedUrls];
        setEntry({ ...entry, attachments: allAttachments });
    };

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
                            getDayProps={getDayProps}
                        />
                    </Modal>
                    <Button onClick={open}><FaCalendarDay />View Calendar</Button>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Flex >
                            {/* <FileInput placeholder="Upload photos" multiple accept='image/*' clearable onChange={handleImageChange} size="lg" style={{ width: '60%' }} value={entry.attachments} /> */}
                            <div style={{ width: '60%' }}>
                                <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleImageChange} style={{ width: '100%', height: '50%' }}>
                                    <Text ta="center">Drop images here</Text>
                                </Dropzone>

                                <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
                                    {previews}
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