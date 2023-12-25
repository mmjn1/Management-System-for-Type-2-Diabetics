import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { resetRegistered } from "../features/user";



const EmailVerificationMessage = (props) => {
    const { data } = props;
    const name = data.first_name;

    const dispatch = useDispatch();

    const { registered } = useSelector((state) => state.user);

    useEffect(() => {
        if (registered) {

            dispatch(resetRegistered());

            // remove the submitCount from the local storage
            if (localStorage.getItem("submitCount")) {
                localStorage.removeItem("submitCount");
            }
        }
    }, [dispatch]);




    return (
        <div className="card border-0 ">
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm border-0 col-md-10 mx-auto ">
                        <div className="card-body text-center d-flex flex-column gap-5  rounded">
                            <div className="d-flex flex-column gap-4">
                                <i className="fas fa-envelope-open-text fa-4x text-primary"></i>
                                <h5 className="card-title">Verify your account</h5>
                            </div>
                            {/* # make some space between the icon and the text */}
                            <div className="col-md-8  mx-auto pb-4">
                                <div className="verify-content d-flex flex-column gap-2">
                                    <p className="card-text text-body-secondary">
                                        Hi <span className="text-primary-emphasis">{name}</span>, <br />
                                        We've sent you an email with a link to verify your account. Please check your inbox and click on the verification link to activate your account.
                                    </p>
                                    <span className="text-muted "> <b>Didn't receive the email?</b> click to <a href="/resend-verification-email">re-send verification link</a></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <div className="">
                            <div className="fs-6 text-muted">

                                <span className="text-muted">
                                    Already have an account?
                                    <Link
                                        to="/login"
                                        className="btn btn-link
                                    text-decoration-none
                                    text-primary
                                    fw-bold
                                    fs-6
                                    ">
                                        Login
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default EmailVerificationMessage;