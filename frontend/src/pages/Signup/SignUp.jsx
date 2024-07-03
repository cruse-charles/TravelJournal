import React from 'react';
import { useState } from 'react';
import axios from 'axios';

import { Image, Title, Flex, Text, Stack, Group, ScrollArea, Button, Modal, TextInput, Textarea, Indicator, Paper, PasswordInput } from '@mantine/core';


const SignUp = () => {
    const [formValues, setFormValues] = useState({})
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('api/auth/signup', formValues)
            .then(res => {
                setLoading(false);
                setError(null);
            })
            .catch(err => {
                console.log(err.response.data);
                setError(err.response.data.message);
                setLoading(false);
            })
    }

    return (
        <Paper>
            <Text size="xl" fw={700}>SignUp</Text>
            <form onSubmit={handleSubmit} onChange={handleChange}>
                <TextInput type="text" id="username" label="Username"></TextInput>
                <TextInput type="email" id="email" label="Email"></TextInput>
                <PasswordInput type="text" id="password" label="Password"></PasswordInput>
                <Button disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </Button>
                {error && <div>{error}</div>}
            </form>
        </Paper>
    )
}

export default SignUp