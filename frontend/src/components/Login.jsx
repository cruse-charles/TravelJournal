import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure, signOutFailure, signOutSuccess, signOutStart } from '../redux/user/userSlice';

const Login = () => {
    const dispatch = useDispatch();

    const [loginCredentials, setLoginCredentials] = useState({})
    const { currentUser, loading, error } = useSelector(state => state.user);

    const handleChange = (e) => {
        const { id, value } = e.target
        setLoginCredentials({ ...loginCredentials, [id]: value })
    }

    // POST request to login endpoint
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Dispatch signInStart action of userSlice
        dispatch(signInStart());
        await axios.post('api/auth/login', loginCredentials)
            // set errors and loading state
            .then(res => {
                dispatch(signInSuccess(res.data));
            })
            .catch(err => {
                dispatch(signInFailure(err.response.data.message));
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
        <>
            <div>Login</div>
            <form onSubmit={handleSubmit}>
                <input type="email" id="email" placeholder="Email" onChange={handleChange} />
                <input type="password" id="password" placeholder="Password" onChange={handleChange} />
                <button disabled={loading}>{loading ? 'Loading...' : 'Log in'}</button>
                {error && <div>{error}</div>}
            </form>
            <button onClick={handleLogout}>logout</button>
        </>
    )
}

export default Login