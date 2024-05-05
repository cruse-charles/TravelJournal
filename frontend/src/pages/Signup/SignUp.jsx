import React from 'react';
import { useState } from 'react';
import axios from 'axios';

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
        <>
            <div>SignUp</div>
            <form onSubmit={handleSubmit}>
                <input type="text" id="username" placeholder="Username" onChange={handleChange} />
                <input type="email" id="email" placeholder="Email" onChange={handleChange} />
                <input type="password" id="password" placeholder="Password" onChange={handleChange} />
                <button disabled={loading}>
                    {loading ? 'Loading...' : 'Sign Up'}
                </button>
                {error && <div>{error}</div>}
            </form>
        </>
    )
}

export default SignUp