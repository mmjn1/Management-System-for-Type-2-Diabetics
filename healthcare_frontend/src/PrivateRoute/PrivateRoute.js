import { Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userDetails } from "../features/api/Userdetails";

/**
 * PrivateRoutePatient is designed to protect patient routes. 
 * It ensures that only authenticated users with a 'Patient' type can access child components.
 * 
 * On component mount, it dispatches the userDetails action to fetch and store user details in the Redux store.
 * It checks for a user token in local storage to verify if the user is authenticated.
 * 
 * If authenticated, it checks the user type stored in local storage. If the user type is 'Doctor', 
 * it redirects to a 'not-allowed' page, preventing access to patient-specific routes.
 * If the user type is 'Patient', it renders the child components (routes) using the Outlet component from react-router-dom.
 * If the user is not authenticated (no token found), it redirects to the login page.
 * 
 */

const PrivateRoutePatient = ({ children }) => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state.userDetails) // Hook to access the current user details from Redux store.
    useEffect(() => {
        dispatch(userDetails())
    }, []);


    // Retrieve the authentication token and user type from local storage.
    let auth = localStorage.getItem('token')
    let type = localStorage.getItem('type')


    // Retrieve the authentication token and user type from local storage.
    if (auth) {
        if (type === 'Doctor') {
            return <Navigate to='/not-allowed'/> // Redirects to a 'not-allowed' page if the user is a doctor.
        }
        if (type === 'Patient') {
            return <Outlet/> 
        }
    } else {
        return <Navigate to="/auth/login"/> 
    }


}

export default PrivateRoutePatient;