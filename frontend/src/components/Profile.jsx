import React from 'react'
import { useSelector } from 'react-redux'

const Profile = () => {

    const { currentUser } = useSelector(state => state.user)

    return (
        <div>PROFILE PAGE OF : {currentUser.username}</div>
    )
}

export default Profile