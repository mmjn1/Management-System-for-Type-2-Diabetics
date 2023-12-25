import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField } from "../formComponents/TextField";
import * as Yup from "yup";

const ProfileFormValidationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .label("Email address <span class='text-danger'>*</span>"),
    // .placeholder("Email address"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .label("Password"),
    re_password: Yup.string()
        .required("Confirmed password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .label("Confirmed password"),
    first_name: Yup.string()
        .required("First name is required")
        .matches(/^[a-zA-Z]+$/, "First name must be only letters")
        // .notRequired()
        .label("First name"),
    middle_name: Yup.string()
        .notRequired().label("Middle name")
        .matches(/^[a-zA-Z]+$/, "Middle name must be only letters"),


    last_name: Yup.string()
        .required("Last name is required")
        .matches(/^[a-zA-Z]+$/, "Last name must be only letters")
        .label("Last name"),

    mobile_number: Yup.string()
        .required("Mobile number is required")
        .matches(
            /^(\+\d{1,3})?\d{8,10}$/,
            "Please enter a valid phone number"
        )
        .label("Telephone number")
        .max(15, "Phone number is too long")
        .min(10, "Phone number is too short"),

    type_of_diabetes: Yup.string()
        .required("Type of diabetes is required")
        .oneOf(["Type 1", "Type 2", "Gestational", "Other"], "Invalid type of diabetes")
        .label("Type of Diabetes"),
    
    date_of_diagnosis: Yup.date()
        .required("Date of diagnosis is required")
        .max(new Date(), "Date of diagnosis can't be in the future")
        .label("Date of Diagnosis"),

    blood_sugar_level: Yup.number()
        .required("Blood sugar level is required")
        .min(0, "Blood sugar level must be a positive number")
        .label("Blood Sugar Level"),

    dietary_habits: Yup.string()
        .required("Dietary habits are required")
        .label("Dietary Habits"),

    physical_activity_level: Yup.string()
        .required("Physical activity level is required")
        .label("Physical Activity Level"),
    
    date_last_HbA1c_test_and_result: Yup.date()
        .required("Date of last HbA1c test and result is required")
        .max(new Date(), "Date of last HbA1c test can't be in the future")
        .label("Date of Last HbA1c Test and Result"),
   
 
});



const ProfileForm = (props) => {
    const { error, isSubmitting, currentFormSubmitCount } = props;
    const [errors, setErrors] = useState(error || {});

    const handleSubmit = (values) => {
        props.next(values, false);
    };

    const smallScreen = window.matchMedia("(max-width: 768px)").matches;
    console.log("smallScreen", smallScreen);


    return (
        <Formik
            validationSchema={ProfileFormValidationSchema}
            initialValues={props.data}
            onSubmit={handleSubmit}
            // validateOnChange={!props.isSubmitting}
            // validateOnBlur={!props.isSubmitting}
            isSubmitting={props.isSubmitting}
            error={props.error}
            // trigger validation on onSubmition
            submitCount={props.currentFormSubmitCount}
        >
            {({ values, handleChange }) => (
                <Form className="d-flex flex-column">
                    <div className="name-section">
                        <div className="header lead">
                            <h3 className="fs-5">Your Name</h3>
                        </div>
                        <div className=" name-section-group d-flex gap-md-2 gap-sm-2 justify-content-between flex-md-row flex-column">
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="First Name"
                                    name="first_name"
                                    required={true}
                                    tabIndex={1}
                                    type="text"
                                    error={props.error.first_name}
                                    currentSubmitCount={currentFormSubmitCount}
                                    // className="p-inputtext p-component p-text-input w-100"

                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.first_name) {
                                            props.setErrors({});
                                            // delete formErrors from local storage
                                            if (localStorage.getItem("formErrors")) {
                                                localStorage.removeItem("formErrors");
                                            }
                                            if (localStorage.getItem("currentStepWithErrors")) {
                                                localStorage.removeItem("currentStepWithErrors");
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Middle Name"
                                    name="middle_name"
                                    required={false}
                                    type="text"
                                    tabIndex={2}
                                    error={props.error.middle_name}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.middle_name) {
                                            props.setErrors({});
                                            // delete formErrors from local storage
                                            if (localStorage.getItem("formErrors")) {
                                                localStorage.removeItem("formErrors");
                                            }
                                            if (localStorage.getItem("currentStepWithErrors")) {
                                                localStorage.removeItem("currentStepWithErrors");
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Last Name"
                                    required={true}
                                    tabIndex={3}
                                    name="last_name"
                                    type="text"
                                    error={props.error.last_name}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // console.log("pasword handle change method ++++++++ 0-----+++++ ", e);
                                        // check the field error and reset error from the error object
                                        if (props.error.last_name) {
                                            props.setErrors({});
                                            // delete formErrors from local storage
                                            if (localStorage.getItem("formErrors")) {
                                                localStorage.removeItem("formErrors");
                                            }
                                            if (localStorage.getItem("currentStepWithErrors")) {
                                                localStorage.removeItem("currentStepWithErrors");
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="address-section">
                        <div className="header lead d-flex gap-2 align-items-center">
                            <h3 className="fs-5">Your Address</h3>
                        </div>
                        <div className=" address-section-group d-flex flex-column">
                            <div className="half-address-section d-flex gap-md-2 gap-sm-2  gap-2 justify-content-between flex-md-row flex-column">
                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="Address Line 1"
                                        required={true}
                                        tabIndex={4}
                                        name="address_line_1"
                                        type="text"
                                        error={props.error.address_line_1}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.address_line_1) {
                                                props.setErrors({});
                                                // delete formErrors from local storage
                                                if (localStorage.getItem("formErrors")) {
                                                    localStorage.removeItem("formErrors");
                                                }
                                                if (localStorage.getItem("currentStepWithErrors")) {
                                                    localStorage.removeItem("currentStepWithErrors");
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="Address Line 2"
                                        name="address_line_2"
                                        required={false}
                                        tabIndex={5}
                                        type="text"
                                        error={props.error.address_line_2}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.address_line_2) {
                                                props.setErrors({});
                                                // delete formErrors from local storage
                                                if (localStorage.getItem("formErrors")) {
                                                    localStorage.removeItem("formErrors");
                                                }
                                                if (localStorage.getItem("currentStepWithErrors")) {
                                                    localStorage.removeItem("currentStepWithErrors");
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="City"
                                        required={true}
                                        tabIndex={6}
                                        name="city"
                                        type="text"
                                        error={props.error.city}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.city) {
                                                props.setErrors({});
                                                // delete formErrors from local storage
                                                if (localStorage.getItem("formErrors")) {
                                                    localStorage.removeItem("formErrors");
                                                }
                                                if (localStorage.getItem("currentStepWithErrors")) {
                                                    localStorage.removeItem("currentStepWithErrors");
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="half-address-section d-flex gap-md-2 gap-sm-2  gap-2 justify-content-between flex-md-row flex-column">
                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="County"
                                        name="county"
                                        type="text"
                                        required={false}
                                        tabIndex={7}
                                        error={props.error.county}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.county) {
                                                props.setErrors({});
                                                // delete formErrors from local storage
                                                if (localStorage.getItem("formErrors")) {
                                                    localStorage.removeItem("formErrors");
                                                }
                                                if (localStorage.getItem("currentStepWithErrors")) {
                                                    localStorage.removeItem("currentStepWithErrors");
                                                }
                                            }
                                        }}
                                    />
                                </div>

                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="Zipcode"
                                        name="zipcode"
                                        tabIndex={8}
                                        required={true}
                                        type="text"
                                        error={props.error.zipcode}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.zipcode) {
                                                props.setErrors({});
                                                // delete formErrors from local storage
                                                if (localStorage.getItem("formErrors")) {
                                                    localStorage.removeItem("formErrors");
                                                }
                                                if (localStorage.getItem("currentStepWithErrors")) {
                                                    localStorage.removeItem("currentStepWithErrors");
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="Country"
                                        name="country"
                                        required={true}
                                        tabIndex={9}
                                        type="text"
                                        error={props.error.country}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.country) {
                                                props.setErrors({});
                                                // delete formErrors from local storage
                                                if (localStorage.getItem("formErrors")) {
                                                    localStorage.removeItem("formErrors");
                                                }
                                                if (localStorage.getItem("currentStepWithErrors")) {
                                                    localStorage.removeItem("currentStepWithErrors");
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div> */}

                    <div className="contact-section">
                        <div className="header lead">
                            <h3 className="fs-5">Your Contact Details</h3>
                        </div>
                        <div className=" contact-section-group d-flex gap-md-2 gap-sm-2  gap-2 justify-content-between flex-md-row flex-column">
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Mobile Number"
                                    required={true}
                                    name="mobile_number"
                                    type="text"
                                    tabIndex={10}
                                    error={props.error.mobile_number}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.mobile_number || props.error.contact_person_mobile_number) {
                                            props.setErrors({});
                                            console.log("i am here")
                                            // delete formErrors from local storage
                                            if (localStorage.getItem("formErrors")) {
                                                localStorage.removeItem("formErrors");
                                            }
                                            if (localStorage.getItem("currentStepWithErrors")) {
                                                localStorage.removeItem("currentStepWithErrors");
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Telephone Number"
                                    name="tel_number"
                                    type="text"
                                    required={true}
                                    tabIndex={11}
                                    error={props.error.tel_number}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.tel_number) {
                                            props.setErrors({});
                                            // delete formErrors from local storage
                                            if (localStorage.getItem("formErrors")) {
                                                localStorage.removeItem("formErrors");
                                            }
                                            if (localStorage.getItem("currentStepWithErrors")) {
                                                localStorage.removeItem("currentStepWithErrors");
                                            }
                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Personal Email"
                                    name="secondary_email"
                                    type="text"
                                    tabIndex={12}
                                    error={props.error.secondary_email}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.secondary_email) {
                                            props.setErrors({});
                                            // delete formErrors from local storage
                                            if (localStorage.getItem("formErrors")) {
                                                localStorage.removeItem("formErrors");
                                            }
                                            if (localStorage.getItem("currentStepWithErrors")) {
                                                localStorage.removeItem("currentStepWithErrors");
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* # sub form */}
                    <div className="d-flex w-100 flex-column col-md-2 gap-md-2 gap-2 mt-4 mt-md-5 md-sm-4">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            tabIndex={13}
                            style={{
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",
                            }}
                        >
                            Next
                        </button>
                        <button
                            type="button"
                            tabIndex={14}
                            className="btn btn-outline-primary"
                            onClick={() => props.prev(values)}
                            style={{
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",
                            }}
                        >
                            Back
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default ProfileForm;