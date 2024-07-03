import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';

import { NavLink, Text, Button, TextInput, Space, Paper, PasswordInput, Center } from '@mantine/core';


const SignUp = () => {
    const [formValues, setFormValues] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();



    const handleChange = (e) => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('api/auth/signup', formValues);
            setError(null);

            // If signup is successful, proceed to login
            const loginResponse = await axios.post('api/auth/login', formValues);
            dispatch(signInSuccess(loginResponse.data));
            navigate('/profile');
        } catch (err) {
            console.log(err.response?.data);
            setError(err.response?.data?.message);
        } finally {
            setLoading(false);
        }


        // await axios.post('api/auth/signup', formValues)
        //     .then(res => {
        //         setLoading(false);
        //         setError(null);
        //         const loginResponse = await axios.post('api/auth/login', formValues)
        //         dispatch(signInSuccess(loginResponse.data));
        //     })
        //     .catch(err => {
        //         console.log(err.response.data);
        //         setError(err.response.data.message);
        //         setLoading(false);
        //     })

        // await axios.post('api/auth/login', formValues)
        //     // set errors and loading state
        //     .then(res => {
        //         dispatch(signInSuccess(res.data));
        //         navigate('/profile')
        //     })
        //     .catch(err => {
        //         dispatch(signInFailure(err.response.data.message));
        //     })
    }

    return (
        <Center >
            <Paper style={{ width: '50%' }}>
                <Text size="xl" fw={700}>SignUp</Text>
                <form onSubmit={handleSubmit} onChange={handleChange}>
                    <TextInput type="text" id="username" label="Username"></TextInput>
                    <TextInput type="email" id="email" label="Email"></TextInput>
                    <PasswordInput type="text" id="password" label="Password"></PasswordInput>
                    <Space h='md' />
                    <Button type='submit' color='black' disabled={loading}>
                        {loading ? 'Loading...' : 'Sign Up'}
                    </Button>
                    <NavLink w={'35%'} p={0} href='/login' label='Already have an account? Click here.'></NavLink>
                    {error && <div>{error}</div>}
                </form>
            </Paper>
        </Center>
    )
}

export default SignUp