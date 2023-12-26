//import Layout from "components/Layout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetRegistered } from "../features/user";

import BackgroundImage from "../assets/img/diabetes.png"

import { Image } from "@themesberg/react-bootstrap";
import LoginForm from "../components/LoginForm";



const LoginPage = () => {



    const dispatch = useDispatch();
    const { registered, loading } = useSelector(state => state.user);


    const [navbarHeight, setNavbarHeight] = useState(0);
    const heightValue = `calc(100vh - ${navbarHeight}px)`;

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [data, setData] = useState({
        email: "",
        password: "",
    });


    useEffect(() => {
        dispatch(resetRegistered());
        const navbarElement = document.querySelector('.navbar'); // Replace with the actual classname of your navbar
        const navbarComputedStyle = getComputedStyle(navbarElement);
        const navbarHeight = parseInt(navbarComputedStyle.height, 10);
        setNavbarHeight(navbarHeight);

        console.log("errors changed", errors);

    }, [dispatch, errors]);



    return (
        // <Layout title="Login | Placement Assistance" content="Login page">

        <div className="position-relative">
            <div className="d-flex justify-content-end align-items-center justify-content-md-none">
                {/* col-md-5 flex-3 */}
                <div className={"order-2 order-md-1 position-absolute position-md-static position-lg-static  start-0 start-md-0"}>
                    {/* <div className={`${currentStep > 0 ? "col-md-1" : "col-md-5 flex-3"}`} > */}
                    <Image src={BackgroundImage} alt="Placement Assistance logo" style={{ height: heightValue }} height="100%" width="100%" />
                </div>
                {/* <div className="col-md-7"> */}
                <div className={`col-md-7 `} >

                    {/* <div className={`${currentStep > 0 ? "col-md-9" : "col-md-5 flex-3"}`} > */}
                    <div className="text-center d-flex flex-column justify-content-evenly h-100 container ">
                        <div className="header lead">
                            <h1>Login</h1>
                            <span className="text-muted">Welcome back, please login to your account.
                            </span>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-">
                                    <div className="card border-0 text-start">
                                        {/* style={{ maxWidth: "35rem" }} */}
                                        <div className="card-body container">

                                            <LoginForm
                                                initialValues={data}
                                                error={errors}
                                                setErrors={setErrors}
                                                isSubmitting={isSubmitting}
                                                loading={loading}
                                            />


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

       
    )
}

export default LoginPage;