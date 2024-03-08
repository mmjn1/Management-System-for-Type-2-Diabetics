import React, { useEffect, useState } from "react";
import './assets/glucocare/css/ForgetPage/forgetPassword.css'
import './assets/glucocare/css/ForgetPage/file2.css'
import * as yup from "yup";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ForgetPasswordConfirm } from "./features/api/forgetPassword_confirm";
import { useNavigate } from 'react-router-dom';
import FooterPage from "./components/Footer/FooterPage";

const SetPassword = () => {
    const navigate = useNavigate();
    const params = useParams();
    const ChangePassStatus = useSelector((state) => state.ForgetPasswordConfirm.status)
    console.log(ChangePassStatus)
    useEffect(() => {
        setuid(params.uid)
        settoken(params.token)
    }, [])
    useEffect(() => {
        if (ChangePassStatus === "succeeded") {
            setReset(true)
        }
    }, [ChangePassStatus])
    const dispatch = useDispatch();
    const [reset, setReset] = useState(false)
    const [uid, setuid] = useState('')
    const [token, settoken] = useState('')

    const validationSchema = yup.object().shape({

        password: yup
            .string()
            .required("Enter password")
            .min(8, "Password must be at least 8 characters long")
            .matches(/[a-z]/, "At least 1 lowercase letter required")
            .matches(/[A-Z]/, "At least 1 uppercase letter required")
            .matches(/\d/, "At least 1 number required")
            .matches(/[\^$*.[\]{}()?"!@#%&/,><':;|_~`]/, "At least 1 special character required"),

        confirmPassword: yup
            .string()
            .required("Please Confirm Password")
            .oneOf([yup.ref('password'), null], "Password and Confirm Password doesn't match"),
    });

    const handleRedirect = () => {
        navigate('/auth/login');
    };

    const handleFunction = (values) => {
        const data = {
            uid: uid, token: token, new_password: values.password, re_new_password: values.confirmPassword
        }
        dispatch(ForgetPasswordConfirm(data))

    }
    return (<>
        <div id="kt_body" style={{marginTop: '7%'}}
             className=" header-fixed header-mobile-fixed subhead er-enabled subheader-fixed aside-enabled aside-fixed aside-minimize-hoverable page-loading">
            <div className="d-flex flex-column flex-root" style={{height: '85vh'}}>
                <div className="login login-4 wizard d-flex flex-column flex-lg-row flex-column-fluid">
                    <div
                        className="login-container order-2 order-lg-1 d-flex flex-center flex-row-fluid px-7 pt-lg-0 pb-lg-0 pt-4 pb-6 bg-white">
                        <div className="login-content d-flex flex-column pt-lg-0 pt-12">                    
                            {reset ? (<div className="login-form">
                                    <div className="pb-5 pb-lg-2">
                                        <h3 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg text-center">Password
                                            reset</h3>
                                        <p className="text-muted font-weight-bold font-size-h4 text-center">Your
                                            password has been successfully reset. <br/>Click below to login</p>
                                    </div>

                                    <div className="form-group d-fl ex flex-wrap">
                                        <div className="d-grid gap-2">
                                            <button onClick={handleRedirect} className="btn btn-primary"
                                                    type="button">Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>


                            ) : (<div className="login-form">
                                <Formik
                                    validationSchema={validationSchema}
                                    onSubmit={(values) => handleFunction(values)}
                                    initialValues={{
                                        password: '', confirmPassword: ''
                                    }}
                                >
                                    {({
                                          handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
                                      }) => (<Form className="form" id="kt_login_forgot_form" noValidate
                                                   onSubmit={handleSubmit}>
                                        <div className="pb-5 pb-lg-15">
                                            <h3 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">Set
                                                new password</h3>
                                            <p className="text-muted font-weight-bold font-size-h4">Your new
                                                password
                                                must be different to previously used password.</p>
                                        </div>
                                        <div className="form-group">
                                            <Form.Control
                                                className="form-control form-control-solid h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                                type="password" placeholder="Enter your password" name="password"
                                                value={values.password}
                                                onChange={handleChange}
                                                isInvalid={!!errors.password}
                                                required
                                                autoComplete="off"/>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </div>
                                        <div className="form-group">
                                            <Form.Control
                                                className="form-control form-control-solid h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                                                type="password" placeholder="Confirm your password"
                                                name="confirmPassword"
                                                value={values.confirmPassword}
                                                onChange={handleChange}
                                                isInvalid={!!errors.confirmPassword}
                                                required
                                                autoComplete="off"/>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.confirmPassword}
                                            </Form.Control.Feedback>
                                        </div>

                                        <div className="form-group d-flex flex-wrap">
                                            <button onClick={handleRedirect} id="kt_login_forgot_form_submit_button"
                                                    className="btn btn-light-primary font-weight-bolder font-size-h6 px-8 py-4 my-3 mr-4">
                                                Back to login
                                            </button>
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
        <FooterPage/>
    </>)
}
export default SetPassword
