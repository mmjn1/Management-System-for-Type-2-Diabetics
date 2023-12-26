//import Layout from "../Layout";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetRegistered, loginUser, } from "../../features/user";
import { Link, useNavigate, useLocation } from "react-router-dom";

import BackgroundImage from "../../assets/img/diabetes.png"

import { Image } from "@themesberg/react-bootstrap";
import LoginForm from "../../containers/LoginPage";



const PatientLoginPage = (props) => {


    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/student/dashboard";
    // console.log("from", location);

    const { registered, loading, isAuthenticated } = useSelector(state => state.user);

    console.log("I am in StudentLoginPage");

    if (isAuthenticated) {
        // redirect to dashboard and also replace current page url 
        navigate("/");
    }

    // console.log("from", from);

    const dispatch = useDispatch();


    const [navbarHeight, setNavbarHeight] = useState(0);
    const heightValue = `calc(100vh - ${navbarHeight}px)`;




    const [errors, setErrors] = useState({});

    const [isSubmitting, setIsSubmitting] = useState(false);


    const [data, setData] = useState(() => {

        const storedData = localStorage.getItem("formLoginData");

        if (storedData) {
            return JSON.parse(storedData);
        }
        return {
            email: "",
            password: "",
        }

    });


    useEffect(() => {
        const loginData = localStorage.getItem("formLoginData");
        if (loginData) {
            const parsedData = JSON.parse(loginData);
            setData(parsedData);
            localStorage.removeItem("formLoginData");
        }

        const formLoginErrors = localStorage.getItem("formLoginErrors");
        if (formLoginErrors) {
            const parsedErrors = JSON.parse(formLoginErrors);
            setErrors(parsedErrors);
            localStorage.removeItem("formLoginErrors");
        }
    }, []);



    // const handleSetErrors = useCallback((newErrors) => {
    //     console.log("Inside handleSetErrors", newErrors);
    //     setErrors(newErrors);
    // }, [setErrors]);

    const handleSetErrors = useCallback((newErrors) => {
        console.log('Inside handleSetErrors', newErrors);
        console.log('Inside handleSetErrors --> typeof newErrors', typeof newErrors);
        console.log('Inside handleSetErrors --> errors type', typeof errors);
        setErrors(newErrors);
    }, [setErrors, errors]);



    const handleSubmit = (newData, submit = false) => { // first time submit is false
        console.log("handleSubmit -> newData", newData);
        console.log("handleSubmit -> submit", submit);
        setData(newData);
        console.log("I am last updating the data");
        localStorage.setItem("formLoginData", JSON.stringify({ ...data, ...newData }));
        setIsSubmitting(submit);
    };


    const handleChange = (event) => {
        console.log('handleChange -> data', data);
        setData((prevFormData) => ({
            ...prevFormData,
            [event.target.name]: event.target.value,
        }));
    };

    useEffect(() => {
        const navbarElement = document.querySelector('.navbar'); // Replace with the actual classname of your navbar
        const navbarComputedStyle = getComputedStyle(navbarElement);
        const navbarHeight = parseInt(navbarComputedStyle.height, 10);
        setNavbarHeight(navbarHeight);

    }, []);


    // useEffect(() => {

    //     if (isSubmitting) {

    //         data["user_type"] = "student";
    //         dispatch(loginUser(data))
    //             .then((res) => {
    //                 if (res.meta.requestStatus === "fulfilled") {
    //                     console.log("res -> fulfilled", res);
    //                     setIsSubmitting(false);
    //                     // if the student is logged in, redirect to the student dashboard
    //                     navigate(from, { replace: true });
    //                     // console.log("from", from);

    //                 }
    //                 if (res.meta.requestStatus === "rejected") {
    //                     throw res;

    //                 }
    //             })
    //             .catch((err) => {
    //                 const inncome = err.payload;
    //                 console.log("inncome --->", inncome);

    //                 handleSetErrors(err.payload);

    //                 setIsSubmitting(false);
    //             });
    //     }

    //     dispatch(resetRegistered());

    // }, [dispatch, isSubmitting, data, from, navigate]);


    useEffect(() => {
        if (!isSubmitting) {
            return;
        }

        console.log('data useEffect ->', data);

        const formData = { ...data, user_type: 'student' };

        dispatch(loginUser(formData))
            .then((res) => {
                if (res.meta.requestStatus === 'fulfilled') {
                    console.log('res -> fulfilled', res);
                    setIsSubmitting(false);
                    localStorage.removeItem('formLoginData');
                    localStorage.removeItem('formLoginErrors');
                    navigate(from, { replace: true });
                } else {
                    throw res;
                }
            })
            .catch((err) => {
                console.log('err ->', err);
                handleSetErrors(err.payload);
                setIsSubmitting(false);
                localStorage.setItem('formLoginData', JSON.stringify({ ...data }));
                localStorage.setItem('formLoginErrors', JSON.stringify(err.payload));

                window.location.reload();
            });
    }, [dispatch, data, handleSetErrors, isSubmitting, from, navigate]);


    useEffect(() => {
        if (isSubmitting) {
            console.log("errors _-> first use effect", errors);
            setErrors({});
        }
        console.log("errors _-> last use effect", errors);
    }, [isSubmitting, errors]);


    const isStudent = true;

    return (
        // <Layout title="Student Login | Placement Assistance" content="Student login page">

        <div className="position-relative">
            <div className="d-flex justify-content-end align-items-center justify-content-md-none">
                {/* col-md-5 flex-3 */}
                <div
                    className={
                        "order-2 order-md-1 position-absolute position-md-static position-lg-static  start-0 start-md-0"
                    }
                >
                    {/* <div className={`${currentStep > 0 ? "col-md-1" : "col-md-5 flex-3"}`} > */}
                    <Image
                        src={BackgroundImage}
                        alt="Placement Assistance logo"
                        style={{ height: heightValue }}
                        height="100%"
                        width="100%"
                    />
                </div>
                {/* <div className="col-md-7"> */}
                <div className={`col-md-6 col-11 order-1 order-md-2 bg-white text-end d-flex justify-content-center`}
                    style={
                        {
                            height: heightValue,
                            position: "relative",
                            zIndex: 2,

                        }
                    }
                >
                    {/* <div className={`${currentStep > 0 ? "col-md-9" : "col-md-5 flex-3"}`} > */}
                    <div className="text-center d-flex flex-column justify-content-evenly h-100 container ">
                        <div className="header lead">
                            <h1 className="fw-bold mb-4">Student Login</h1>

                            <span className="text-muted">
                                Welcome back, please login to your account.
                            </span>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <div className="card border-0 text-start">
                                        {/* style={{ maxWidth: "35rem" }} */}
                                        <div className="card-body container">
                                            {/* {errors ? (
                                                <div className="alert alert-danger col-md-7 mx-auto" role="alert">
                                                    {[errors.email, errors.password, errors.non_field_errors].filter((error) => error).map((error, index) => (
                                                        <div key={index}>{error}</div>
                                                    ))}
                                                </div>
                                            ) : null
                                            } */}
                                            {/* // show the error message if there is any */}
                                            {errors && errors.detail && (
                                                <div
                                                    className="alert alert-danger col-md-7 mx-auto"
                                                    role="alert"
                                                >
                                                    {errors.detail}
                                                </div>
                                            )}

                                            <LoginForm
                                                data={data}
                                                error={errors}
                                                setErrors={handleSetErrors}
                                                onSubmit={handleSubmit}
                                                loading={loading}
                                                handleChange={handleChange}
                                                isStudent={isStudent}
                                                setData={setData}
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

        // </Layout>
    );
}

export default PatientLoginPage;