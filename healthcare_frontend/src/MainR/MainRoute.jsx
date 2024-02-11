import {Navigate, Route, Routes} from 'react-router-dom'
import Layout from '../layout/Layout'
import LoginContainer from '../containers/public/auth/Login'
import RegisterContainer from '../containers/public/registration/Register'
import HomeContainer from "../containers/protected/Home/index";
import ForgetPassword from "../ForgetPassword";
import SetPassword from "../SetPassword";

import LandingHomeContainer from "../containers/public/landing/LandingPage";

function Main() {
    const token = 0
    return (
        <Routes>
            <Route path="/" element={<Layout/>}>
                {/* public routes */}
                <Route index element={token ? <HomeContainer/> : <LandingHomeContainer/>}/>
                <Route path="/auth/login" element={token ? <Navigate to="/" replace/> : <LoginContainer/>}/>
                <Route path="/auth/register" element={token ? <Navigate to="/" replace/> : <RegisterContainer/>}/>
                <Route path="/auth/forgetPassword" element={token ? <Navigate to="/" replace/> : <ForgetPassword/>}/>
                <Route path="/auth/setPassword/:uid/:token/" element={token ? <Navigate to="/" replace/> : <SetPassword/>}/>

            </Route>
        </Routes>
    )
}

export default Main
