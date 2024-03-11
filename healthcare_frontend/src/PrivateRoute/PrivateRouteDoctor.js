import { Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userDetails } from "../features/api/Userdetails";

/**
 * PrivateRouteDoctor secures routes intended only for users with a 'Doctor' type.
 * It uses Redux to manage authentication status and user details, ensuring that only authenticated doctors can access certain routes.
 *
 * Upon mounting, the component dispatches the userDetails action to update the user details in the Redux store.
 * It checks for a user token in local storage to confirm if the user is authenticated.
 *
 * If authenticated, it further checks the user type stored in local storage. If the user type is 'Doctor', 
 * the component renders the child components (routes) using the Outlet component from react-router-dom, allowing full access to doctor-specific routes.
 * If the user type is 'Patient', it redirects them to a 'not-allowed' page to prevent access to doctor-specific areas.
 * If no user token is found, indicating the user is not authenticated, it redirects to the login page.
 *
 */

const PrivateRouteDoctor = () => {
    const dispatch = useDispatch()
    const details = useSelector((state) => state.userDetails)
    useEffect(() => {
        dispatch(userDetails())
    }, []);

    let auth = localStorage.getItem('token')
    let type = localStorage.getItem('type')


    // Redirect based on user authentication and type.
    if (auth) {
        if (type === 'Doctor') {
            return <Outlet/> // Render child components for authenticated doctors

        }
        if (type === 'Patient') {
            return <Navigate to='/not-allowed'/> // Redirect patients away from doctor routes.
        }
    } else {
        return <Navigate to="/auth/login"/>
    }

}

export default PrivateRouteDoctor;