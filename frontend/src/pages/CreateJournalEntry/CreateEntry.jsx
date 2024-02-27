import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { TextInput, Textarea, Button, Flex, Stack, Group, Modal, SimpleGrid, Image, Text, Indicator } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { FaCalendarDay } from "react-icons/fa6";

import useUserEntryDateHash from '../../hooks/useUserEntryDateHash';
import { getFormattedDate, getSelectedDayProps } from '../../utils/dateUtils';

const CreateEntry = () => {
    // Retrieve entryIdHash containing date:id of user's entries from custom hook
    const { entryIdHash } = useUserEntryDateHash();

    // Retrieve current user from redux store, setting errors, setting formValues
    const { currentUser } = useSelector(state => state.user);

    // State vars for files, error, formValues
    const [files, setFiles] = useState([]);
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState({
        title: '',
        text: '',
        date: null,
        attachments: [],
        user: currentUser ? currentUser._id : null,
    });

    // useDisclosure hook to open and close modal, useNavigate hook to navigate to new entry
    const [opened, { open, close }] = useDisclosure(false);
    const navigate = useNavigate();



    // Create previews of images from files array using URLs
    // const previews = files.map((file, index) => {
    //     const imageUrl = URL.createObjectURL(file);
    //     return (
    //         <Indicator key={imageUrl} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(index)}>
    //             <Image key={imageUrl} src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
    //         </Indicator>
    //     );
    // });

    const previews = files.map((file) => {
        const imageUrl = URL.createObjectURL(file);
        return { imageUrl, fileName: file.name }
    })

    // const deleteSelectedImage = (index) => {
    //     // Remove file from files array and update formValues
    //     const updatedFiles = files.filter((file, fileIndex) => fileIndex !== index);
    //     setFiles(updatedFiles);

    //     setFormValues({
    //         ...formValues,
    //         attachments: updatedFiles
    //     })
    // }

    const deleteSelectedImage = (fileName) => {
        // Remove file from files array and update formValues
        const updatedFiles = files.filter((file) => file.name !== fileName);
        setFiles(updatedFiles);

        setFormValues({
            ...formValues,
            attachments: updatedFiles
        })
    }

    // TODO: Look into using axios library to make a POST request to the backend instead of doing this basic 'createform'
    const createFormData = () => {
        //create FormData object to submit object with files
        const data = new FormData();

        // append data and files to FormData object
        data.append('title', formValues.title);
        data.append('text', formValues.text);
        data.append('date', formValues.date);
        data.append('user', formValues.user)

        //TODO: THIS HERE IS ACTUALLY DOING 3 ATTACHMENT KEYS WITH EACH FILE IN ONE, CHANGE TO MAKE IT AN ARRAY UNDER ONE KEY
        formValues.attachments.forEach((file, index) => {
            data.append(`attachments`, file);
        });


        // BETTER THAN THE ABOVE APPENDS
        // const data = {
        //     title: formValues.title,
        //     text: formValues.text,
        //     date: formValues.date,
        //     user: formValues.user,
        //     attachments: formValues.attachments
        // }

        return data;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Post request with FormData object and content type for files, navigate to entry upon creation
        try {
            const data = createFormData();
            const res = await axios.post('api/entry', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            navigate(`/entry/${res.data}`)
        } catch (error) {
            setError(error.response.data.message)
        }
    }

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    // add new images to entry and files
    const handleImageChange = (newFiles) => {
        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles)
        setFormValues({
            ...formValues,
            attachments: updatedFiles,
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Flex >
                    <div style={{ width: '60%' }}>
                        <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleImageChange} style={{ width: '100%', height: '50%' }}>
                            <Text ta="center">Drop images here</Text>
                        </Dropzone>
                        <SimpleGrid cols={{ base: 1, sm: 4 }} mt={previews.length > 0 ? 'xl' : 0}>
                            {/* {previews} */}
                            {previews.map((preview, index) => {
                                // const imageUrl = URL.createObjectURL(preview);
                                return (
                                    // <Indicator key={imageUrl} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(index)}>
                                    <Indicator key={preview.imageUrl} size={15} color="blue" offset={-2} onClick={() => deleteSelectedImage(preview.fileName)}>
                                        <Image key={preview.imageUrl} src={preview.imageUrl} onLoad={() => URL.revokeObjectURL(preview.imageUrl)} />
                                    </Indicator>
                                )
                            })}
                        </SimpleGrid>
                    </div>
                    <Stack style={{ width: '40%' }} gap='xs'>
                        <Group>
                            <TextInput onChange={handleChange} placeholder='Title of your day!' name='title' radius="xs" size='lg' style={{ width: '80%' }} />
                            <Button type='submit'>Save</Button>
                        </Group>
                        <Textarea name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={15} maxRows={15} size='lg' radius="xs" />
                    </Stack>
                    {error && <div>{error}</div>}
                </Flex>
                <Modal opened={opened} onClose={close} title="Select a Date" size='auto'>
                    <DatePicker
                        onChange={(date) => setFormValues({ ...formValues, date: date })}
                        getDayProps={(date) => getSelectedDayProps(formValues, date)}
                        excludeDate={(date) => entryIdHash[getFormattedDate(date)]}
                    />
                </Modal>
            </form>
            <Button onClick={open}><FaCalendarDay />View Calendar</Button>
        </>
    )
}

export default CreateEntry