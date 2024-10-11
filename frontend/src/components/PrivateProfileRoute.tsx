import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { RootState } from './types'


const PrivateProfileRoute = () => {
    const { currentUser } = useSelector((state: RootState) => state.user)

    return (
        currentUser ? <Outlet /> : <Navigate to='/login' />
    )
}

export default PrivateProfileRoute

// Can put this file in a 'providers' folder. Provider files are for components that provide some kind of context or data to other components. This file is a provider because it provides the currentUser data to the Profile component.