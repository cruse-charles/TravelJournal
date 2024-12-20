import { ChangeEvent, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';

import { NavLink, Text, Button, TextInput, Space, Paper, PasswordInput, Center } from '@mantine/core';
import styles from './Signup.module.css'
import { ErrorResponse, ApiErrors, UserFormValues } from './types';

const defaultUserFormValues = {
    username: '',
    email: '',
    password: ''
}


const SignUp = () => {
    const [formValues, setFormValues] = useState<UserFormValues>(defaultUserFormValues)
    const [error, setError] = useState<ApiErrors>(null)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLFormElement>) => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
            const error = err as ErrorResponse
            setError(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Center >
            <Paper className={styles.signupContainer}>
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
                    {error && <Text color='red'>{error}</Text>}
                </form>
            </Paper>
        </Center>
    )
}

export default SignUp