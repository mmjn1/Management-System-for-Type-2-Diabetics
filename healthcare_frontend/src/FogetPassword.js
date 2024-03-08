import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import './assets/glucocare/css/ForgetPage/forgetPassword.css'
import './assets/glucocare/css/ForgetPage/file2.css'

import { ForgetPasswordfunction } from "./features/api/forgetPassword";
import FooterPage from "./components/Footer/FooterPage";

const ForgetPassword = () => {
    const dispatch = useDispatch();
    const [send, setSend] = useState(false)
    const [email, setEmail] = useState(false)

    const forgetStatus = useSelector((state) => state.forgetPasswordfunction.status)
    const validationSchema = Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
    });
    const handleFunction = (values) => {
        setEmail(values.email)
        const data = { email: values.email }
        dispatch(ForgetPasswordfunction(data))
    }
    const re_send = () => {
        const data = { email: email }
        dispatch(ForgetPasswordfunction(data))
    }
    useEffect(() => {
        if (forgetStatus === "succeeded") {
            setSend(true)
        }
    }, [forgetStatus])
    return (

        <>
            <div id="kt_body" style={{ marginTop: '6%', display: 'inline-flex !important' }}
                className="">
                <div className="d-flex flex-column flex-root" style={{ height: '86vh' }}>
                    <div className="login login-4 wizard d-flex flex-column flex-lg-row flex-column-fluid">
                        <div
                            className="login-container order-2 order-lg-1 d-flex flex-center flex-row-fluid px-7 pt-lg-0 pb-lg-0 pt-4 pb-6 bg-white">
                            <div className="login-content d-flex flex-column pt-lg-0 pt-12">
                               
                                {send ? (<div className="login-form">

                                    <div className="pb-5 pb-lg-2">
                                        <h3 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">Check
                                            you email</h3>
                                        <p className="text-muted font-weight-bold font-size-h4">We sent a password
                                            reset link to <b className="font-weight-boldest">{email}</b></p>
                                    </div>

                                    <div style={{ backgroundColor: 'lightgray', border: 'lightgray' }}
                                        className="alert alert-primary d-flex align-items-center" role="alert">
                                        {/*?xml version="1.0" encoding="utf-8"?*/}{/* Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools */}
                                        <div>
                                            <p className="pl-1 font-weight-bold font-size-h4"
                                                style={{ color: 'black' }}> Check
                                                your
                                                email for a link to reset your password. If it doesn't appear within
                                                a few minutes, check your spam folder. Otherwise, email is not
                                                registered with us
                                            </p>
                                        </div>
                                    </div>


                                    <div className="pb-5 py-lg-2">
                                        <p className="text-muted font-weight-bold font-size-h4">Didn't receive the
                                            email?
                                            <span className='ml-5 text-primary'><button onClick={re_send}
                                                className="btn btn-outline-primary">Click to resend</button></span>
                                        </p>
                                    </div>

                                    <div className="pb-5 pb-lg-1">
                                        <p className="text-muted font-weight-bold font-size-h4"><a href='login'>
                                            <svg width="40px" height="40px" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round"
                                                    strokeLinejoin="round" />
                                                <g id="SVGRepo_iconCarrier">
                                                    <path d="M6 12H18M6 12L11 7M6 12L11 17" stroke="#3699FF"
                                                        strokeWidth="0.8640000000000001" strokeLinecap="round"
                                                        strokeLinejoin="round" />
                                                </g>
                                            </svg>
                                            Back to log in</a></p>
                                    </div>


                                </div>) : (<div className="login-form">
                                    <Formik
                                        validationSchema={validationSchema}
                                        onSubmit={(values) => handleFunction(values)}
                                        initialValues={{
                                            email: '',
                                        }}
                                    >
                                        {({
                                            handleSubmit, handleChange, values, errors,
                                        }) => (<Form className="form" id="kt_login_forgot_form" noValidate
                                            onSubmit={handleSubmit}>
                                            <div className="pb-5 pb-lg-15">
                                                <h3 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">Reset
                                                    Your Password</h3>
                                                <p className="text-muted font-weight-bold font-size-h4">Enter your
                                                    email
                                                    address
                                                    and we'll send you a link to reset your password.</p>
                                            </div>
                                            <div className="form-group">
                                                <Form.Control
                                                    className="form-control form-control-solid h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                                    type="email" placeholder="Enter Email" name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    isInvalid={!!errors.email}
                                                    required
                                                    autoComplete="off" />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </div>
                                            <div className="form-group d-flex flex-wrap">
                                                <a href="login" type="submit"
                                                    id="kt_login_forgot_form_submit_button"
                                                    className="btn btn-light-primary font-weight-bolder font-size-h6 px-8 py-4 my-3 mr-4">
                                                    Back to login
                                                </a>
                                                <button type='submit'
                                                    className="btn btn-primary font-weight-bolder font-size-h6 px-8 py-4 my-3">Submit
                                                </button>
                                            </div>
                                        </Form>)}
                                    </Formik>
                                </div>)}
                            </div>
                        </div>
                       
                    </div>
                </div>
            </div>
            <FooterPage />
        </>)

}
export default ForgetPassword