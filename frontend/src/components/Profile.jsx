import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice'

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


    return (
        <>
            <div>PROFILE PAGE OF : {currentUser.username}</div>
            <form onSubmit={handleSubmit}>
                <input type='text' placeholder={currentUser.username} id='username' onChange={handleChange}></input>
                <input type='email' placeholder={currentUser.email} id='email' onChange={handleChange}></input>
                <input type='password' placeholder='password' id='password  ' onChange={handleChange}></input>
                <button disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            </form>
            <p>{error ? error : ''}</p>
        </>
    )
}

export default Profile