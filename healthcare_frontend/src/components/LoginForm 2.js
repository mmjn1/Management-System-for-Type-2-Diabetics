import { Formik, Form } from "formik";
import { TextField } from "../components/formComponents/TextField";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";




const LoginFormValidationSchema = Yup.object({

    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .label("Email <span class='text-danger'>*</span>"),

    password: Yup.string()
        .required("Password is required")
});
const LoginForm = (props) => {


    const { setErrors, isStudent, isStaffLogin, setData, data, handleChange, error } = props;

    const handleSubmit = (values) => {
        // pass the date to the parent component
        props.onSubmit(values, true);
    };

    return (
        <Formik

            validationSchema={LoginFormValidationSchema}
            initialValues={props.data}
            error={props.error}
            validate={(values) => {
                const errors = {};

                // check email ending with student_register.le.ac.uk
                // lower case the email
                values.email = values.email.toLowerCase();
                if (isStudent) {
                    if (!values.email.endsWith("student.le.ac.uk")) {
                        console.log("isStudentEmail");
                        // setIsStudentEmail(true);
                        errors.email = "Please enter a valid student email address";
                    }
                }

                // student cannot login via employer login page 
                if (!isStudent) {
                    if (values.email.endsWith("student.le.ac.uk")) {
                        console.log("isStudentEmail");
                        // setIsStudentEmail(true);
                        errors.email = "Please use the student login page";
                    }
                }

                // validate the email with regex
                const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (!emailRegex.test(values.email)) {
                    errors.email = "Please enter a valid email address";
                }

                return errors;
            }
            }
            onSubmit={handleSubmit}
            isSubmitting={props.isSubmitting}
            setErrors={props.setErrors}
        >
            {({ handleChange }) => (

                <Form className="d-flex flex-column gap-1 col-md-7 mx-auto">
                    <div className="d-flex flex-column">
                        <div className="form-group">
                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                required={true}
                                // error={props.error.email}
                                tabIndex={1}
                                onChange={(e) => {
                                    handleChange(e);
                                    // check the field error and reset error from the error object
                                    console.log("props.error.email", props.error.email)
                                    console.log("Error object", error);
                                    if (props.error?.email || props.error?.detail) {
                                        console.log(props.error, "props.error");
                                        setErrors({});
                                        console.log(" I am inside the change event enail")
                                    }
                                }}

                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                label="Password"
                                name="password"
                                type="password"
                                required={true}
                                tabIndex={2}
                                // error={props.error.password}
                                onChange={(e) => {
                                    handleChange(e);
                                    // check the field error and reset error from the error object
                                    console.log("props.error.password", props.error.password)
                                    if (props.error?.password || props.error?.detail) {
                                        setErrors({});
                                        console.log(" I am inside the change event password")
                                    }
                                }}
                            />

                            {/* {props.error && props.error.password && <div className="text-danger">{props.error.password}</div>} */}
                        </div>
                        <div className="text-start ">
                            <div className="">
                                <div className="fs-6 text-muted">

                                    <span className="text-muted">
                                        <Link
                                            to={'/reset-password'}
                                            className="btn btn-link text-decoration-none text-primary fs-6">
                                            Forgot password ?
                                        </Link>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* // forgot password link */}





                    <div className="d-flex w-100 flex-column gap-3 mt-3">

                        {props.loading ?
                            (<div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>)
                            :
                            (<button type="submit" className="btn btn-primary"
                                tabIndex={6}
                                style={
                                    {
                                        fontSize: "1rem",
                                        padding: "0.75rem 0.75rem",
                                    }
                                }
                            >
                                Login
                            </button>
                            )}
                    </div>


                    {(isStaffLogin ? (
                        "") :
                        (
                            <div className="text-center mt-4">
                                <div className="">
                                    <div className="fs-6 text-muted">

                                        <span className="text-muted">
                                            Don't have an account?
                                            <Link
                                                to={isStudent ? "/register/student" : "/register/employer"}
                                                className="btn btn-link
                                    text-decoration-none
                                    text-primary
                                    fw-bold
                                    fs-6
                                    ">
                                                Register
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    )}
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;