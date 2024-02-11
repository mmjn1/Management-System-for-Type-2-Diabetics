import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import logo from "./assets/glucocare/img/logo.png";
import side from "./assets/glucocare/img/login-visual-4.svg";

import "./assets/glucocare/css/ForgetPage/forgetPassword.css"
import "./assets/glucocare/css/ForgetPage/file2.css";

import { ForgetPasswordfunction } from "./features/api/forgetPasswordslice";
import FooterPage from "./components/Footer/FooterPage";

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const [send, setSend] = useState(false);
  const [email, setEmail] = useState(false);

  const forgetStatus = useSelector(
    (state) => state.ForgetPasswordfunction.status
  );
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });
  const handleFunction = (values) => {
    setEmail(values.email);
    const data = { email: values.email };
    dispatch(ForgetPasswordfunction(data));
  };
  const re_send = () => {
    const data = { email: email };
    dispatch(ForgetPasswordfunction(data));
  };
  useEffect(() => {
    if (forgetStatus === "succeeded") {
      setSend(true);
    }
  }, [forgetStatus]);
  return (
    <>
      <div
        id="kt_body"
        style={{ marginTop: "6%", display: "inline-flex !important" }}
        className=""
      >
        <div
          className="d-flex flex-column flex-root"
          style={{ height: "86vh" }}
        >
          <div className="login login-4 wizard d-flex flex-column flex-lg-row flex-column-fluid">
            <div className="login-container order-2 order-lg-1 d-flex flex-center flex-row-fluid px-7 pt-lg-0 pb-lg-0 pt-4 pb-6 bg-white">
              <div className="login-content d-flex flex-column pt-lg-0 pt-12">
                <a href="/" className="login-logo pb-xl-20 pb-15">
                  <img src={logo} className="max-h-100px" alt="" />
                </a>
                {send ? (
                  <div className="login-form">
                    <div className="pb-5 pb-lg-2">
                      <h3 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">
                        Check you email
                      </h3>
                      <p className="text-muted font-weight-bold font-size-h4">
                        We sent a password reset link to{" "}
                        <b className="font-weight-boldest">{email}</b>
                      </p>
                    </div>

                    <div
                      style={{
                        backgroundColor: "lightgray",
                        border: "lightgray",
                      }}
                      className="alert alert-primary d-flex align-items-center"
                      role="alert"
                    >
                      {/*?xml version="1.0" encoding="utf-8"?*/}
                      {/* Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools */}
                      <svg
                        width="120px"
                        height="120px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M19.5 12C19.5 16.1421 16.1421 19.5 12 19.5C7.85786 19.5 4.5 16.1421 4.5 12C4.5 7.85786 7.85786 4.5 12 4.5C16.1421 4.5 19.5 7.85786 19.5 12ZM21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM11.25 13.5V8.25H12.75V13.5H11.25ZM11.25 15.75V14.25H12.75V15.75H11.25Z"
                          fill="#080341"
                        />
                      </svg>

                      <div>
                        <p
                          className="pl-1 font-weight-bold font-size-h4"
                          style={{ color: "black" }}
                        >
                          {" "}
                          Check your email for a link to reset your password. If
                          it doesn't appear within a few minutes, check your
                          spam folder. Otherwise, email is not registered with
                          us
                        </p>
                      </div>
                    </div>

                    <div className="pb-5 py-lg-2">
                      <p className="text-muted font-weight-bold font-size-h4">
                        Didn't receive the email?
                        <span className="ml-5 text-primary">
                          <button
                            onClick={re_send}
                            className="btn btn-outline-primary"
                          >
                            Click to resend
                          </button>
                        </span>
                      </p>
                    </div>

                    <div className="pb-5 pb-lg-1">
                      <p className="text-muted font-weight-bold font-size-h4">
                        <a href="login">
                          <svg
                            width="40px"
                            height="40px"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                            <g
                              id="SVGRepo_tracerCarrier"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M6 12H18M6 12L11 7M6 12L11 17"
                                stroke="#3699FF"
                                strokeWidth="0.8640000000000001"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </g>
                          </svg>
                          Back to log in
                        </a>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="login-form">
                    <Formik
                      validationSchema={validationSchema}
                      onSubmit={(values) => handleFunction(values)}
                      initialValues={{
                        email: "",
                      }}
                    >
                      {({ handleSubmit, handleChange, values, errors }) => (
                        <Form
                          className="form"
                          id="kt_login_forgot_form"
                          noValidate
                          onSubmit={handleSubmit}
                        >
                          <div className="pb-5 pb-lg-15">
                            <h3 className="font-weight-bolder text-dark font-size-h2 font-size-h1-lg">
                              Reset Your Password
                            </h3>
                            <p className="text-muted font-weight-bold font-size-h4">
                              Enter your email address and we'll send you a link
                              to reset your password.
                            </p>
                          </div>
                          <div className="form-group">
                            <Form.Control
                              className="form-control form-control-solid h-auto py-7 px-6 border-0 rounded-lg font-size-h6"
                              type="email"
                              placeholder="Enter Email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              isInvalid={!!errors.email}
                              required
                              autoComplete="off"
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.email}
                            </Form.Control.Feedback>
                          </div>
                          <div className="form-group d-flex flex-wrap">
                            <a
                              href="login"
                              type="submit"
                              id="kt_login_forgot_form_submit_button"
                              className="btn btn-light-primary font-weight-bolder font-size-h6 px-8 py-4 my-3 mr-4"
                            >
                              Back to login
                            </a>
                            <button
                              type="submit"
                              className="btn btn-primary font-weight-bolder font-size-h6 px-8 py-4 my-3"
                            >
                              Submit
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                )}
              </div>
            </div>
            <div className="login-aside order-1 order-lg-2 bgi-no-repeat bgi-position-x-right">
              <div
                className="login-conteiner bgi-no-repeat bgi-position-x-right bgi-position-y-bottom"
                style={{ backgroundImage: `url(${side})` }}
              >
                <h3 className="pt-lg-40 pl-lg-20 pb-lg-0 pl-10 py-20 m-0 d-flex justify-content-lg-start font-weight-boldest display5 display1-lg text-white">
                  We Got
                  <br />A Surprise
                  <br />
                  For You
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterPage />
    </>
  );
};
export default ForgetPassword;