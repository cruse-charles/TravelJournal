import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileInput, TextInput, Textarea, Button, Flex, Stack, Group, Modal } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import CalendarViewEntries from '../../components/CalendarViewEntries';
import { FaCalendarDay } from "react-icons/fa6";


const CreateEntry = () => {
    const { currentUser } = useSelector(state => state.user);
    const navigate = useNavigate();
    const [opened, { open, close }] = useDisclosure(false);

    const [error, setError] = useState(null);

    const [formValues, setFormValues] = useState({
        title: '',
        text: '',
        date: null,
        attachments: [],
        user: currentUser ? currentUser._id : null,
    });

    // Look into using axios library to make a POST request to the backend instead of doing this basic 'createform'
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

        // Post request with FormData object and content type for files
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

    const handleImageChange = (files) => {
        setFormValues({
            ...formValues,
            attachments: Array.from(files),
        });
    };

    const getDayProps = (date) => {
        if (formValues.date !== null && (formValues.date.getTime() === date.getTime())) {
            return { style: { backgroundColor: 'var(--mantine-color-blue-filled)', color: 'var(--mantine-color-white)' } }
        }
        return {};
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Flex >
                    <FileInput placeholder="Upload photos" multiple accept='image/*' clearable onChange={handleImageChange} size="lg" style={{ width: '60%' }} />
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
                        getDayProps={getDayProps}
                    />
                </Modal>
            </form>
            {/* < CalendarViewEntries /> */}
            <Button onClick={open}><FaCalendarDay />View Calendar</Button>
        </>
    )
}

export default CreateEntry