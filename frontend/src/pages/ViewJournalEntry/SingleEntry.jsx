import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, FileInput, TextInput, Textarea, SimpleGrid, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';

import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getFormattedDate } from '../../utils/dateUtils';


// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan, FaCalendarDay } from "react-icons/fa6";

// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO - CLICKING CALENDAR IN EDIT MODE DOESN'T WORK ReferenceError: entryIdHash is not defined
// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO - NEED UNIQUE KEYS, IF I DELETE OUT OF ORDER, PICS GET FUCKED UP
// TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO - DELETE IMAGES FROM S3


const SingleEntry = () => {
    // state vars for entry and loading
    const [entry, setEntry] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)
    const [files, setFiles] = useState([])
    const [attchmentUrls, setAttachmentUrls] = useState([])
    const [previews, setPreviews] = useState([])
    const { entryIdHash } = useUserEntryDateHash();

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
                setPreviews(res.data.attachments)
                setFiles(res.data.attachments)
            }).catch(error => {
                console.log(error.response.data.message)
                setIsLoading(false)
            })

        return () => controller.abort();
    }, [id])

    useEffect(() => {
        console.log('ENTRY', entry)
        console.log('PREVIEWS', previews ? previews : 'No previews')
    }, [entry, previews])

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
        console.log('NEW FILES', newFiles)
        const updatedFiles = [...files, ...newFiles];
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
        setPreviews((prevState) => [...prevState, ...newFiles])
        setEntry({
            ...entry,
            // attachments: Array.from(files),
            attachments: updatedFiles,
        });
    };

    const deleteSelectedImage = (index) => {
        const updatedFiles = previews.filter((_, fileIndex) => fileIndex !== index);
        setFiles(updatedFiles);
        setPreviews(updatedFiles)
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();

        previews.map(async (item) => {
            console.log('PREVIEW ITEM', item)
        })

        const isUrl = (file) => typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));

        const filePromises = previews.map(async (file) => {
            if (isUrl(file)) {
                // Item is a URL, fetch the image and append it as a Blob
                try {
                    const response = await fetch(file);
                    const blob = await response.blob();
                    const filename = file.split('/').pop();
                    const newFile = new File([blob], filename, { type: blob.type });
                    console.log('S3 new file', newFile)
                    return newFile
                    // formData.append('files', newFile);
                } catch (error) {
                    console.error('Error fetching image from URL:', error);
                    return null
                }

            } else {
                // Item is assumed to be a File object
                console.log('FILE UPLOADED BY USER', file)
                // formData.append('files', file);
                return file
                // return Promise.resolve(); // Return a resolved promise for non-URL items
            }
        });

        const updatedFiles = await Promise.all(filePromises);

        updatedFiles.forEach((file, index) => {
            formData.append(`attachments`, file); //NOTE::: HERE THE CONSOLE.LOG IS WIERD WITH JUST OBJECT OBJECT, BUT INDIVIDUAL FILES IN CONSOLE SEEM OK
        })

        Object.keys(entry).forEach(key => {
            if (key !== 'attachments') {
                formData.append(key, entry[key]);
            }
        });

        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        await axios.put(`/api/entry/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        setIsEditing(false)

        await axios.get(`/api/entry/${id}`).then(res => {
            setEntry(res.data); // Update entry with new data including S3 URLs
            setIsLoading(false);
        })
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
                                    {previews.map((item, index) => {
                                        const isFile = item instanceof File;
                                        const src = isFile ? URL.createObjectURL(item) : item;
                                        return (
                                            <Indicator key={index} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(index)}>
                                                <Image key={index} src={src} onLoad={() => URL.revokeObjectURL(src)} />
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