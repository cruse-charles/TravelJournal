import React from 'react'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

const PrivateProfileRoute = () => {
    const { currentUser } = useSelector(state => state.user)

    return (
        currentUser ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateProfileRoute

// Can put this file in a 'providers' folder. Provider files are for components that provide some kind of context or data to other components. This file is a provider because it provides the currentUser data to the Profile component.