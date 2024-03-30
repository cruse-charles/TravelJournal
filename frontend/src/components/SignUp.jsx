import React from 'react';
import { useState } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [formValues, setFormValues] = useState({})

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormValues({ ...formValues, [id]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('api/auth/signup', formValues)
            .then(res => {
                console.log(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            <div>SignUp</div>
            <form onSubmit={handleSubmit}>
                <input type="text" id="username" placeholder="Username" onChange={handleChange} />
                <input type="email" id="email" placeholder="Email" onChange={handleChange} />
                <input type="password" id="password" placeholder="Password" onChange={handleChange} />
                <button>Sign Up</button>
            </form>
        </>
    )
}

export default SignUp