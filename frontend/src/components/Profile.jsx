import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutFailure, signOutSuccess, signOutStart } from '../redux/user/userSlice'

const Profile = () => {

    const dispatch = useDispatch();

    const { currentUser, loading, error } = useSelector(state => state.user)
    const [formData, setFormData] = useState({})

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Dispatch updateUserStart action of userSlice to indicate that the update process has started
        dispatch(updateUserStart())

        // POST request to update user endpoint
        await axios.post(`api/user/update/${currentUser._id}`, formData)
            .then(res => {
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
        <>
            <div>PROFILE PAGE OF : {currentUser.username}</div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder={currentUser.username} id='username' onChange={handleChange}></input>
                <input type='email' placeholder={currentUser.email} id='email' onChange={handleChange}></input>
                <input type='password' placeholder='password' id='password  ' onChange={handleChange}></input>
                <button disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            </form>
            <button onClick={handleLogout}>logout</button>
            <button onClick={handleDeleteUser}>Delete Account</button>
            <p>{error ? error : ''}</p>
        </>
    )
}

export default Profile