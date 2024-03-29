import { Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userDetails } from "../features/api/Userdetails";

/**
 * PrivateRouteLogin is used for general redirection based on user's role and authentication status.
 *
 * It uses Redux to manage global state for user details and authentication status.
 * 
 * It dispatches an action to fetch user details. It then checks if a user token exists in local storage
 * to determine if the user is authenticated. Depending on the user's type (Doctor or Patient), it redirects to the respective dashboard. 
 * If the user is not authenticated, it redirects to the login page.
 * 
 */

const PrivateRouteLogin = () => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state.userDetails) // Hook to access the current user details from Redux store.
    useEffect(() => {
        dispatch(userDetails())
    }, []);


    // Retrieve the authentication token from local storage.
    let auth = localStorage.getItem('token')

    // Redirects to the appropriate dashboard based on the user type
    if (auth) {
        if (type === 'Doctor') {
            return <Navigate to='/doctor/dashboard'/>
        }
        if (type === 'Patient') {
            return <Navigate to='patient/dashboard'/>
        }
    } else {
        return <Navigate to="/auth/login"/>
    }

}

export default PrivateRouteLogin;