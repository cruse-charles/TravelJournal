import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [loginCredentials, setLoginCredentials] = useState({})
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { id, value } = e.target
        setLoginCredentials({ ...loginCredentials, [id]: value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post('api/auth/login', loginCredentials)
            .then(res => {
                console.log(res.data)
                setError(null)
            })
            .catch(err => {
                console.log(err.response.data)
                setError(err.response.data.message)
            })
    }

    return (
        <>
            <div>Login</div>
            <form onSubmit={handleSubmit}>
                <input type="email" id="email" placeholder="Email" onChange={handleChange} />
                <input type="password" id="password" placeholder="Password" onChange={handleChange} />
                <button>Login</button>
                {error && <div>{error}</div>}
            </form>
        </>
    )
}

export default Login