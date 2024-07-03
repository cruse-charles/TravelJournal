import React, { useState } from 'react'
import axios from 'axios';
import { useSelector } from 'react-redux';
import CalendarViewPages from './CalendarViewPages';
import { FileInput, TextInput, Textarea, Button, Grid, rem, Flex, Stack, Group } from '@mantine/core';
import { DatePicker } from '@mantine/dates';

const CreatePage = () => {
    const { currentUser } = useSelector(state => state.user);

    const [error, setError] = useState(null);

    const [formValues, setFormValues] = useState({
        title: '',
        text: '',
        date: '',
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

            const res = await axios.post('api/page', data, { headers: { 'Content-Type': 'multipart/form-data' } });
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

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Flex >
                    <FileInput label="Upload photos" placeholder="Upload photos" multiple accept='image/*' clearable onChange={handleImageChange} size="lg" style={{ width: '60%' }} />
                    <Stack style={{ width: '40%' }} gap='xs'>
                        <Group>
                            <TextInput onChange={handleChange} label='Write your Title' placeholder='Title of your day!' name='title' radius="xs" size='lg' style={{ width: '80%' }} />
                            <Button type='submit'>Save</Button>
                        </Group>
                        <Textarea name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={15} maxRows={15} size='lg' radius="xs" />
                    </Stack>
                    {error && <div>{error}</div>}
                </Flex>
                <DatePicker onChange={(date) => setFormValues({ ...formValues, date: date })} />
            </form>




            {/* <form onSubmit={handleSubmit}>
                <Grid justify='center'>
                    <Grid.Col span={7} >
                        <FileInput label="Upload photos" placeholder="Upload photos" multiple accept='image/*' clearable onChange={handleImageChange} size="lg" />
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <TextInput onChange={handleChange} label='Write your Title' placeholder='Title of your day!' name='title' radius="xs" size='lg' />
                        <Textarea name='text' onChange={handleChange} placeholder='Write what happened this day!' autosize minRows={10} maxRows={10} size='lg' radius="xs" />
                        <Button type='submit'>Save</Button>
                    </Grid.Col>
                    <Grid.Col span={3}>
                        <DatePicker onChange={(date) => setFormValues({ ...formValues, date: date })} />
                    </Grid.Col>
                    {error && <div>{error}</div>}
                </Grid>
            </form> */}

            {/* < CalendarViewPages /> */}
        </>
    )
}

export default CreatePage