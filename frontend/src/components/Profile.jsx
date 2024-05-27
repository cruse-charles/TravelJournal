import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../redux/user/userSlice'

const Profile = () => {

    const dispatch = useDispatch();

    const { currentUser, loading, error } = useSelector(state => state.user)
    const [formData, setFormData] = useState({})
    const [status, setStatus] = useState(null)

    const handleChange = (e) => {
        console.log(formData)
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        dispatch(updateUserStart())

        await axios.post(`api/user/update/${currentUser._id}`, formData)
            .then(res => {
                console.log(res.data)
                dispatch(updateUserSuccess(res.data))
            })
            .catch(err => {
                console.log(err.response.data)
                dispatch(updateUserFailure(err.response.data))
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
        </>
    )
}

export default Profile