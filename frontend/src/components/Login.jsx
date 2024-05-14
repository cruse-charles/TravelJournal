import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [loginCredentials, setLoginCredentials] = useState({})
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { id, value } = e.target
        setLoginCredentials({ ...loginCredentials, [id]: value })
    }

    // POST request to login endpoint
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await axios.post('api/auth/login', loginCredentials)
            // set errors and loading state
            .then(res => {
                setError(null)
                setLoading(false)
            })
            .catch(err => {
                setError(err.response.data.message)
                setLoading(false)
            })
    }

    return (
        <>
            <div>Login</div>
            <form onSubmit={handleSubmit}>
                <input type="email" id="email" placeholder="Email" onChange={handleChange} />
                <input type="password" id="password" placeholder="Password" onChange={handleChange} />
                <button disabled={loading}>{loading ? 'Loading...' : 'Log in'}</button>
                {error && <div>{error}</div>}
            </form>
        </>
    )
}

export default Login