import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice';
import { NavLink, Text, Button, TextInput, Space, Paper, Center } from '@mantine/core';

import styles from './Login.module.css'
import {RootState} from './types'

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginCredentials, setLoginCredentials] = useState({})
    const { loading, error } = useSelector((state: RootState) => state.user);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setLoginCredentials({ ...loginCredentials, [id]: value })
    }

    // POST request to login endpoint
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Dispatch signInStart action of userSlice
        dispatch(signInStart());
        await axios.post('api/auth/login', loginCredentials)
            // set errors and loading state
            .then(res => {
                dispatch(signInSuccess(res.data));
                navigate('/profile')
            })
            .catch(err => {
                dispatch(signInFailure(err.response.data.message));
            })
    }

    return (
        <Center>
            <Paper className={styles.loginContainer}>
                <Text size='xl' fw={700}>Login</Text>
                <form onSubmit={handleSubmit}>
                    <TextInput type="email" id="email" label="Email" onChange={handleChange} />
                    <TextInput type="password" id="password" label="Password" onChange={handleChange} />
                    <Space h='md' />
                    <Button type='submit' color='black' disabled={loading}>{loading ? 'Loading...' : 'Log in'}</Button>
                    <NavLink w={'35%'} p={0} href='/signup' label="Don't have an account? Click here."></NavLink>
                    {error && <Text color='red'>{error}</Text>}
                </form>
            </Paper>
        </Center>
    )
}

export default Login