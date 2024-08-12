import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../redux/user/userSlice'
import CalendarViewEntries from '../../components/CalendarViewEntries'
import UserEntries from './UserEntries'
import { useNavigate } from 'react-router-dom';


import { Button, TextInput, Stack, Group, Text, PasswordInput } from '@mantine/core';

const Profile = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentUser, loading, error } = useSelector(state => state.user)
    const [formData, setFormData] = useState({})
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
        setErrors({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.password || formData.password.length < 8) {
            setErrors((prevErrors) => ({ ...prevErrors, password: 'Password must be at least 8 characters long' }))
            return;
        }

        // Dispatch updateUserStart action of userSlice to indicate that the update process has started
        dispatch(updateUserStart())

        // POST request to update user endpoint
        await axios.post(`api/user/update/${currentUser._id}`, formData)
            .then(res => {
                dispatch(updateUserSuccess(res.data))
            })
            .catch(err => {
                dispatch(updateUserFailure(err.response.data.message))
            })
    }

    const handleNewTripClick = () => {
        navigate('/create')
    }


    return (
        <Stack >
            <Group justify='space-between' p='xl' align='flex-start' style={{ width: '100%', height: '40%' }}>
                <Stack style={{ width: '65%' }}>
                    <Group>
                        <Text size="xl" fw={700} >Your Trips</Text>
                        <Button color='black' onClick={handleNewTripClick}>+ New Trip</Button>
                    </Group>
                    <UserEntries />
                </Stack>
                <CalendarViewEntries scale={1.6} style={{ width: '30%' }} entry={null} />
            </Group>
            <Group style={{ width: '100%' }} justify='center'>
                <Stack gap='xs' p='xl' style={{ justifyContent: 'center', width: '50%' }}>
                    <Text size="xl" fw={700}>Account Information</Text>
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        <Stack>
                            <TextInput label='Username' type='text' placeholder={currentUser.username} id='username' ></TextInput>
                            <TextInput label='Email' type='email' placeholder={currentUser.email} id='email' ></TextInput>
                            <PasswordInput error={errors.password} label='Password' type='password' id='password' ></PasswordInput>
                            <Button color='black' type='submit' disabled={loading} variant="filled">{loading ? 'Updating...' : 'Save Changes'}</Button>
                        </Stack>
                    </form>
                    <p>{error ? error : ''}</p>
                </Stack>
            </Group>
        </Stack>
    )
}

export default Profile