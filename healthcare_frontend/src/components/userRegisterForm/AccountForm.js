import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";

// import { TextField } from "components/formComponents/TextField";

import { TextField } from "../formComponents/TextField";

import * as Yup from "yup";
import { Link } from "react-router-dom";

import { selectIsLoading } from "../../features/user";
import { useSelector } from "react-redux";

import { Password } from "primereact/password";
import { Divider } from "primereact/divider";
import { InputMask } from "primereact/inputmask";
import { InputText } from "primereact/inputtext";

import { Button } from "primereact/button";

const AccountFormValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .label("Email Address <span className='text-danger'>*</span>"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .label("Password")
    .min(8, "Must be 8 characters or more")
    .matches(/[a-z]+/, "One lowercase character")
    .matches(/[A-Z]+/, "One uppercase character")
    .matches(/[@$!%*#?&]+/, "One special character")
    .matches(/\d+/, "One number"),
  re_password: Yup.string()
    .required("Confirmed password is required")
    .label("Confirmed Password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

const AccountForm = (props) => {
  const {
    error,
    isSubmitting,
    currentFormSubmitCount,
    setErrors,
    errorInStep,
    setCurrentStepWithErrors,
    isEmployerRegister,
  } = props;

  console.log(props.isEmployerRegister);
  console.log("AccountForm -> props.error", props.error);

  const handleSubmit = (values) => {
    props.next(values, false);
  };

  const [hasLowercase, setLowercase] = useState(false);
  const [hasUppercase, setUppercase] = useState(false);
  const [hasNumeric, setNumeric] = useState(false);
  const [hasMinLength, setMinLength] = useState(false);
  const [hasSpecialChar, setSpecialChar] = useState(false);

  const passwordHeader = <div className="font-bold mb-3">Pick a password</div>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0 line-height-3">
        <li className="d-flex gap-2 ">
          {hasLowercase ? (
            <span className="text-success">
              <i className="fa-regular fa-check"></i>
            </span>
          ) : (
            <span className="text-danger">
              <i className="fa-regular fa-xmark"></i>
            </span>
          )}

          <span className={hasLowercase ? "text-success" : "text-danger"}>
            At least one lowercase
          </span>
        </li>
        <li className="d-flex gap-2">
          {hasUppercase ? (
            <span className="text-success">
              <i className="fa-regular fa-check"></i>
            </span>
          ) : (
            <span className="text-danger">
              <i className="fa-regular fa-xmark"></i>
            </span>
          )}

          <span className={hasUppercase ? "text-success" : "text-danger"}>
            At least one uppercase
          </span>
        </li>
        <li className="d-flex gap-2">
          {hasNumeric ? (
            <span className="text-success">
              <i className="fa-regular fa-check"></i>
            </span>
          ) : (
            <span className="text-danger">
              <i className="fa-regular fa-xmark"></i>
            </span>
          )}
          <span className={hasNumeric ? "text-success" : "text-danger"}>
            At least one number
          </span>
        </li>
        <li className="d-flex gap-2">
          {hasMinLength ? (
            <span className="text-success">
              <i className="fa-regular fa-check"></i>
            </span>
          ) : (
            <span className="text-danger">
              <i className="fa-regular fa-xmark"></i>
            </span>
          )}
          <span className={hasMinLength ? "text-success" : "text-danger"}>
            At least 8 characters
          </span>
        </li>
        <li className="d-flex gap-2">
          {hasSpecialChar ? (
            <span className="text-success">
              <i className="fa-regular fa-check"></i>
            </span>
          ) : (
            <span className="text-danger">
              <i className="fa-regular fa-xmark"></i>
            </span>
          )}
          <span className={hasSpecialChar ? "text-success" : "text-danger"}>
            At least one special character
          </span>
        </li>
      </ul>
    </>
  );

  const loading = useSelector(selectIsLoading);

  console.log("Error messages in AccountForm", error);

  return (
    <Formik
      validationSchema={AccountFormValidationSchema}
      validate={(values) => {
        const errors = {};
        if (values.password !== values.re_password) {
          errors.re_password = "Passwords must match";
        }

        // lower case the email
        values.email = values.email.toLowerCase();
        const emailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(values.email)) {
          errors.email = "Please enter a valid email address";
        }
        // if (props.error.email) {
        //     errors.email = props.error.email;
        //     console.log(errors, "errors.email");
        // }

        return errors;
      }}
      initialValues={props.data}
      onSubmit={handleSubmit}
      error={props.error}
      isSubmitting={props.isSubmitting}
      submitCount={props.currentFormSubmitCount}
    >
      {({ handleChange }) => (
        <Form className="d-flex flex-column gap-1 col-md-7 mx-auto">
          <div className="form-group">
            <TextField
              label="Email Address"
              name="email"
              type="email"
              required={true}
              error={props.error.email}
              currentSubmitCount={currentFormSubmitCount}
              tabIndex={1}
              onChange={(e) => {
                // console.log(props.error.email, "error.email")
                // console.log(" I am inside the change event enail")
                handleChange(e);

                // check the field error and reset error from the error object
                console.log(props.error.email, "error.email");
                console.log(error);
                if (props.error.email) {
                  setCurrentStepWithErrors(-1);
                  setErrors({});
                  // delete formErrors from local storage
                  if (localStorage.getItem("formErrors")) {
                    localStorage.removeItem("formErrors");
                  }
                  if (localStorage.getItem("currentStepWithErrors")) {
                    localStorage.removeItem("currentStepWithErrors");
                  }
                  console.log("I am inside the change event email");
                }
              }}
            />
          </div>

          <div className="form-group mb-3">
            <div className="p-field d-flex flex-column">
              <label htmlFor="password" className="form-label ">
                Password <span className="text-danger">*</span>
              </label>
              <Field
                name="password"
                id="password"
                type="password"
                className="form-control"
              >
                {({ field, form }) => (
                  <Password
                    {...field}
                    id="password"
                    name="password"
                    feedback={true}
                    error={props.error.password}
                    header={passwordHeader}
                    footer={passwordFooter}
                    promptLabel="Enter password"
                    inputClassName="w-100"
                    mediumRegex={/.{5,8}/}
                    strongRegex={
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    }
                    mediumLabel="Medium"
                    strongLabel="Strong"
                    weakLabel="Weak"
                    toggleMask={true}
                    placeholder="Enter password"
                    tabIndex={2}
                    required={true}
                    className={
                      form.touched.password && form.errors.password
                        ? "p-invalid"
                        : " w-100"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setLowercase(/[a-z]/.test(value));
                      setUppercase(/[A-Z]/.test(value));
                      setNumeric(/\d/.test(value));
                      setMinLength(value.length >= 8);
                      setSpecialChar(
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
                      );
                      handleChange(e);

                      setCurrentStepWithErrors(-1);
                      // check the field error and reset error from the error object
                      if (props.error.password) {
                        setErrors({});
                        // delete formErrors from local storage
                        if (localStorage.getItem("formErrors")) {
                          localStorage.removeItem("formErrors");
                        }
                        if (localStorage.getItem("currentStepWithErrors")) {
                          localStorage.removeItem("currentStepWithErrors");
                        }
                      }
                    }}
                  ></Password>
                )}
              </Field>
              <ErrorMessage
                name="password"
                component="div"
                className="p-invalid text-danger "
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            {/* {props.error && props.error.password && <div className="text-danger">{props.error.password}</div>} */}
          </div>

          <div className="form-group mb-3">
            {/* <TextField
                            label="Confirmed Password"
                            name="re_password"
                            type="password"
                            tabIndex={3}
                            required={true}

                            error={props.error.re_password}
                            currentSubmitCount={currentFormSubmitCount}
                            onChange={(e) => {
                                handleChange(e);
                                // check the field error and reset error from the error object
                                if (props.error.re_password) {
                                    setErrors({});
                                    // delete formErrors from local storage
                                    if (localStorage.getItem("formErrors")) {
                                        localStorage.removeItem("formErrors");
                                    }
                                    if (localStorage.getItem("currentStepWithErrors")) {
                                        localStorage.removeItem("currentStepWithErrors");
                                    }
                                }
                            }}
                        /> */}

            <div className="p-field d-flex flex-column">
              <label htmlFor="re_password" className="form-label ">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <Field
                name="re_password"
                id="re_password"
                type="password"
                className="form-control"
              >
                {({ field, form }) => (
                  <Password
                    {...field}
                    id="re_password"
                    name="re_password"
                    feedback={true}
                    error={props.error.re_password}
                    header={passwordHeader}
                    footer={passwordFooter}
                    promptLabel="Enter password"
                    inputClassName="w-100"
                    mediumRegex={/.{5,8}/}
                    strongRegex={
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
                    }
                    mediumLabel="Medium"
                    strongLabel="Strong"
                    weakLabel="Weak"
                    toggleMask={true}
                    placeholder="Enter password"
                    tabIndex={2}
                    required={true}
                    className={
                      form.touched.re_password && form.errors.re_password
                        ? "p-invalid"
                        : " w-100"
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      setLowercase(/[a-z]/.test(value));
                      setUppercase(/[A-Z]/.test(value));
                      setNumeric(/\d/.test(value));
                      setMinLength(value.length >= 8);
                      setSpecialChar(
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value)
                      );
                      handleChange(e);

                      setCurrentStepWithErrors(-1);
                      // check the field error and reset error from the error object
                      if (props.error.re_password) {
                        setErrors({});
                        // delete formErrors from local storage
                        if (localStorage.getItem("formErrors")) {
                          localStorage.removeItem("formErrors");
                        }
                        if (localStorage.getItem("currentStepWithErrors")) {
                          localStorage.removeItem("currentStepWithErrors");
                        }
                      }
                    }}
                  ></Password>
                )}
              </Field>
              <ErrorMessage
                name="re_password"
                component="div"
                className="p-invalid text-danger "
                style={{ fontSize: "0.8rem" }}
              />
            </div>
            {/* {props.error && props.error.password && <div className="text-danger">{props.error.password}</div>} */}
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-3"
            tabIndex={4}
            style={{
              fontSize: "1rem",
              padding: "0.75rem 0.75rem",
            }}
          >
            Next
          </button>

          <div className="text-center mt-4">
            <div className="">
              <div className="fs-6 text-muted">
                <span className="text-muted">
                  Already have an account?
                  <Link
                    to={
                      isEmployerRegister ? "/employer/login" : "/student/login"
                    }
                    className="btn btn-link
                                    text-decoration-none
                                    text-primary
                                    fw-bold
                                    fs-6
                                    "
                  >
                    Login
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AccountForm;
