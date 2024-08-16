import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, TextInput, Textarea, Indicator, Center } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useDisclosure } from '@mantine/hooks';
import { DatePicker } from '@mantine/dates';
import { Carousel } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { format } from 'date-fns'

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getEntryDayProps, excludeDateFunction } from '../../utils/dateUtils';
import { deleteSelectedFiles, getUpdatedFiles } from '../../utils/uploaderHelper';
import { getUserEntry, getUpdatedEntry, deleteEntry } from '../../utils/apiService';
import { updateFormData } from '../../utils/updateFormData';

// https://react-icons.github.io/react-icons/icons/fa6/
import { FaPencil, FaRegTrashCan, FaCalendarDay } from "react-icons/fa6";
import placeholderImage from '../../assets/DropzonePlaceholder.svg'
import CalendarViewEntries from '../../components/CalendarViewEntries';
import EntryHeader from '../CreateJournalEntry/EntryHeader';

type Entry = {
    title: string;
    text: string;
    date: Date | null;
    attachments: (File | string)[];
}

type Errors = {
    title?: string;
    text?: string;
    message?: string;
}

type ErrorResponse = {
    response: {
        data: {
            message: string;
        }
    }
}

const SingleEntry = () => {
    // state vars for entry, loading, and previews
    const [entry, setEntry] = useState<Entry>({title: '', text: '', date: null, attachments: []});
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false)
    const [previews, setPreviews] = useState<(File | string)[]>([]);
    const [originalEntryDate, setOriginalEntryDate] = useState<Date | null>(null);
    const [errors, setErrors] = useState<Errors>({})
    const [isSaving, setIsSaving] = useState(false)

    // custom hook to get entryIdHash
    const { entryIdHash } = useUserEntryDateHash();

    // ref for autoplay plugin
    const autoplay = useRef(Autoplay({ delay: 3000 }))

    // useDisclosure hook to open and close modal
    const [opened, { open, close }] = useDisclosure(false);

    // extract entry id from url, and navigate function
    // const { id } = useParams();
    const { id } = useParams<{id: string}>();
    const navigate = useNavigate();

    useEffect(() => {
        // fetch entry data and set entry and previews state vars
        const controller = new AbortController();

        // retrieve entry or navigate to profile page if undefined
        // TODO: navigate to 404 page if entry is not found
        if (id) {
            getUserEntry(id, controller.signal)
                .then(entryResponse => {
                    setEntry(entryResponse);
                    setOriginalEntryDate(entryResponse.date);
                    setIsLoading(false);
                    setPreviews(entryResponse.attachments)
                }).catch(error => {
                    setErrors({ message: error.response.data.message })
                    setIsLoading(false)
                })
        } else {
            navigate('/profile')
        }

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
        } catch (err) {
            const error = err as ErrorResponse;
            setErrors({ message: error.response.data.message })
        }
    }

    const startEdit = () => {
        setIsEditing(true)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEntry({ ...entry, [name]: value })
        setErrors({})
    }

    // add new images to entry and previews
    const handleImageChange = (newFiles: File[]) => {
        const updatedFiles = [...entry.attachments, ...newFiles];
        setPreviews((prevState) => [...prevState, ...newFiles])
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };

    // delete preview image from preview and entry
    const deleteSelectedImage = (key: string) => {
        const updatedFiles = deleteSelectedFiles(previews, key)

        setPreviews(updatedFiles)
        setEntry({
            ...entry,
            attachments: updatedFiles,
        });
    };


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    const updateEntry = async (formData: FormData) => {
        try {
            setIsSaving(true)
            const response = await getUpdatedEntry(id, formData)
            setEntry(response.data)
            setIsEditing(false)
            setIsSaving(false)
        } catch (err) {
            const error = err as ErrorResponse;
            setErrors({ message: error.response.data.message })
        }
    }

    return (
        <>
            {!isEditing ? (
                <>
                    <Stack style={{ height: '70vh' }} p='lg' gap='xs'>
                        {/* <Group justify='space-between'>
                            <Group>
                                <Title order={3}>{entry?.date ? format(entry.date, 'MMMM do, yyy') : ''}</Title>
                                <Button color="black" onClick={open} size='sm' variant='outline' style={{ border: 'none' }}><FaCalendarDay /></Button>
                            </Group>
                            <Group>
                                <Button variant="outline" color="black" size="xs" onClick={startEdit}><FaPencil /></Button>
                                <Button onClick={handleDelete} variant="outline" color="black" size="xs"><FaRegTrashCan /></Button>
                            </Group>
                        </Group>
                        <Center>
                            <Title order={1}>{entry?.title}</Title>
                        </Center> */}
                        <EntryHeader handleDelete={handleDelete} startEdit={startEdit} isEditing={false} error={errors} formValues={entry} isSaving={isSaving} handleChange={handleChange} open={open}/>
                        <Flex style={{ height: '100%' }} gap='xl'>
                            <Carousel style={{ width: '50%' }} plugins={[autoplay.current]} onMouseEnter={autoplay.current.stop} onMouseLeave={autoplay.current.reset} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                                {entry?.attachments?.map((imageURL) => {
                                    const src = imageURL as string;
                                    return (
                                        <Carousel.Slide key={src} >
                                            <Image key={src} src={src} />
                                        </Carousel.Slide>
                                    )
                                })}
                            </Carousel>
                            <ScrollArea style={{ width: '50%', height: '100%' }}>
                                <Text style={{ whiteSpace: 'pre-wrap' }}>{entry?.text}</Text>
                            </ScrollArea>
                        </Flex>
                    </Stack>
                    <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                        <CalendarViewEntries scale={1} entry={entry} />
                    </Modal>
                </>
            ) : (
                <>
                    <form onSubmit={handleSubmit}>
                        <Stack style={{ height: '70vh' }}>
                            {/* <Group justify='space-between'>
                                <Group>
                                    <Title order={3}>{entry?.date ? format(entry.date, 'MMMM do, yyy') : ''}</Title>
                                    <Button color="black" onClick={open} size='sm' variant='outline' style={{ border: 'none' }}><FaCalendarDay /></Button>
                                </Group>
                                {isSaving ? <Button type='submit' disabled={isSaving} color="black">Saving...</Button> : <Button type='submit' color="black">Save</Button>}
                            </Group>
                            <Center>
                                <TextInput error={errors.title} onChange={handleChange} placeholder='Title of your day!' name='title' radius="xs" size='lg' style={{ width: '70%' }} value={entry.title} maxLength={40} />
                            </Center> */}
                            <EntryHeader handleDelete={handleDelete} startEdit={startEdit} isEditing={true} error={errors} formValues={entry} isSaving={isSaving} handleChange={handleChange} open={open}/>
                            <Flex style={{ height: '100%' }} gap='xl'>
                                <Carousel style={{ width: '50%' }} height='100%' loop withIndicators slideSize={{ base: '100%' }}>
                                    {previews.map((item) => {
                                        const isFile = item instanceof File;
                                        const src = isFile ? URL.createObjectURL(item) : item;
                                        const key = isFile ? `file-${item.name}` : `url-${item}`;
                                        return (
                                            <Carousel.Slide key={key} >
                                                <Indicator size={15} color="black" label='X' offset={12} style={{ cursor: 'pointer' }} onClick={() => deleteSelectedImage(key)}>
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
                                <Textarea style={{ width: '50%', height: '100%' }} error={errors.text} name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={17} maxRows={17} size='lg' radius="xs" value={entry.text} />
                            </Flex>
                        </Stack>
                        <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                            <DatePicker
                                onChange={(date) => setEntry({ ...entry, date: date })}
                                getDayProps={(date) => getEntryDayProps(entry, date)}
                                excludeDate={(date) => excludeDateFunction(date, originalEntryDate, entryIdHash)}
                            />
                        </Modal>
                    </form>
                </>
            )}
        </>
    )
}

export default SingleEntry