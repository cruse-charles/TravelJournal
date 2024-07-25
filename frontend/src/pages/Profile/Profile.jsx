import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutFailure, signOutSuccess, signOutStart } from '../../redux/user/userSlice'
import CalendarViewEntries from '../../components/CalendarViewEntries'
import UserEntries from './UserEntries'

import { Button, TextInput, Stack, Group, Text, rem, Flex, PasswordInput } from '@mantine/core';
import { Carousel } from '@mantine/carousel';

const Profile = () => {

    const dispatch = useDispatch();

    const { currentUser, loading, error } = useSelector(state => state.user)
    const [formData, setFormData] = useState({})

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('update button clicked')

        // Dispatch updateUserStart action of userSlice to indicate that the update process has started
        dispatch(updateUserStart())

        // POST request to update user endpoint
        await axios.post(`api/user/update/${currentUser._id}`, formData)
            .then(res => {
                console.log(res.data)
                dispatch(updateUserSuccess(res.data))
            })
            .catch(err => {
                dispatch(updateUserFailure(err.response.data.message))
            })
    }

    const handleDeleteUser = async () => {
        // Dispatch deleteUserStart action of userSlice to indicate that the delete process has started
        dispatch(deleteUserStart())

        // DELETE request to delete user endpoint
        await axios.delete(`api/user/delete/${currentUser._id}`)
            .then(res => {
                dispatch(deleteUserSuccess(res.data))
            }).catch(err => {
                dispatch(deleteUserFailure(err.response.data.message))
            })
    }

    const handleLogout = async () => {
        dispatch(signOutStart());
        await axios.get('api/auth/logout')
            .then(() => {
                dispatch(signOutSuccess());
            })
            .catch(err => {
                dispatch(signOutFailure(err.response.data.message));
            })
    }


    return (
        <Stack >
            <Group justify='space-between' p='xl' align='flex-start' style={{ width: '100%', height: '40%' }}>
                <Stack style={{ width: '70%' }}>
                    <Group>
                        <Text size="xl" fw={700} >Your Trips</Text>
                        <Button color='black'>+ New Trip</Button>
                    </Group>
                    <UserEntries />
                </Stack>
                <CalendarViewEntries />
            </Group>
            <Group style={{ width: '100%' }} justify='space-between'>
                <Stack gap='xs' p='xl' style={{ justifyContent: 'center', width: '50%' }}>
                    <Text size="xl" fw={700}>Account Information</Text>
                    <form onSubmit={handleSubmit} onChange={handleChange}>
                        {/* SUXIONG - Can put the onchange on the form tag itself rather than on each input, figure out how to do that */}
                        <Stack>
                            <TextInput label='Username' type='text' placeholder={currentUser.username} id='username' ></TextInput>
                            <TextInput label='Email' type='email' placeholder={currentUser.email} id='email' ></TextInput>
                            <PasswordInput label='Password' type='password' id='password' ></PasswordInput>
                            <Button color='black' type='submit' disabled={loading} variant="filled">{loading ? 'Updating...' : 'Save Changes'}</Button>
                        </Stack>
                    </form>
                </Stack>
                <Stack style={{ alignItems: 'center' }} p='xl'>
                    <Button color='black' style={{ width: rem(500) }} variant="filled" onClick={handleLogout}>Logout</Button>
                    <Button color='black' style={{ width: rem(500) }} variant="filled" onClick={handleDeleteUser}>Delete Account</Button>
                    <p>{error ? error : ''}</p>
                </Stack>
            </Group>
        </Stack>
    )
}

export default Profile