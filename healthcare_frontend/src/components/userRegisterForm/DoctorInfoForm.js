import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField } from "components/formComponents/TextField";
import * as Yup from "yup";


const DoctorInfoValidationSchema = Yup.object({
   
  specialty: Yup.string()
    .required("Specialty is required")
    .label("Specialty"),

  years_of_experience: Yup.number()
    .min(0, "Years of experience cannot be negative")
    .required("Years of experience is required")
    .label("Years of Experience"),

  medical_license_number: Yup.string()
    .required("Medical license number is required")
    .label("Medical License Number"),

  country_of_issue: Yup.string()
    .required("Country of issue is required")
    .label("Country of Issue"),

  year_of_issue: Yup.number()
    .min(1900, "Year of issue seems too far in the past")
    .max(new Date().getFullYear(), "Year of issue can't be in the future")
    .required("Year of issue is required")
    .label("Year of Issue"),

  diabetes_management_experience: Yup.string()
    .required("Diabetes management experience is required")
    .label("Diabetes Management Experience"),

  treatment_approach: Yup.string()
    .required("Treatment approach is required")
    .label("Treatment Approach"),

  contact_hours: Yup.string()
    .required("Contact hours are required")
    .label("Contact Hours"),


});

const DoctorInfoForm = (props) => {
    const { error, isSubmitting, currentFormSubmitCount } = props;
    const [errors, setErrors] = useState(error || {});



    const handleSubmit = (values) => {

        props.next(values, true);
    };


    return (
        <Formik
            validationSchema={CompanyInfoValidationSchema}
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
                            <h3 className="fs-5"> Professional Information </h3>
                        </div>
                        <div className=" name-section-group d-flex gap-md-2 gap-sm-2 justify-content-between flex-md-row flex-column">

                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}

                            >
                                <TextField
                                    label="Specialty"
                                    name="specialty"
                                    required={true}
                                    tabIndex={1}
                                    type="text"
                                    error={props.error.specialty}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.specialty) {
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
                                    label="How many years of experience do you have?"
                                    name="years_of_experience"
                                    type="text"
                                    tabIndex={2}
                                    required={true}
                                    error={props.error.years_of_experience}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.years_of_experience) {
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
                                    label="Medical License Number"
                                    required={true}
                                    tabIndex={3}
                                    name="medical_license_number"
                                    type="text"
                                    error={props.error.medical_license_number}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // console.log("pasword handle change method ++++++++ 0-----+++++ ", e);
                                        // check the field error and reset error from the error object
                                        if (props.error.medical_license_number) {
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


                    <div className="address-section">

                        <div className="header lead d-flex gap-2 align-items-center">
                            <h3 className="fs-5"> Placement Address </h3>
                            <span className=" fw-light text-muted" style={{ fontSize: ".8rem" }}>(Main office/premises address)</span>
                        </div>
                        <div className=" address-section-group d-flex flex-column">

                            <div className="half-address-section d-flex gap-md-2 gap-sm-2  gap-2 justify-content-between flex-md-row flex-column">

                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="Country of Issue"
                                        required={true}
                                        tabIndex={4}

                                        name="country_of_issue"
                                        type="text"
                                        error={props.error.country_of_issue}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.country_of_issue) {
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
                                        label="Year of Issue"
                                        name="year_of_issue"
                                        tabIndex={5}
                                        type="text"
                                        error={props.error.year_of_issue}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.year_of_issue) {
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
                                        label="Diabetes Management Experience"
                                        required={true}
                                        tabIndex={6}

                                        name="diabetes_management_experience"
                                        type="text"
                                        error={props.error.diabetes_management_experience}
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
                                        label="Describe your treatment approach in managing Type 2 Diabetes"
                                        name="treatement_of_approach"

                                        type="text"
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
                                        label="Preffered contact hours for patient communication"
                                        name="contact_hours"
                                        tabIndex={8}
                                        required={true}

                                        type="text"
                                        error={props.error.contact_hours}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.contact_hours) {
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
                                {/* <div className="form-group col-md-4"
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
                                </div> */}
                            </div>

                        </div>
                    </div>
                    {/* 

                    <div className="contact-section">
                        <div className="header lead">
                            <h3 className="fs-5">Your Contact Details</h3>
                        </div>
                        <div className=" contact-section-group d-flex gap-2 justify-content-between">

                            <div className="form-group" style={{ width: "30%" }}>
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
                                        if (props.error.mobile_number) {
                                            setErrors({});

                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group" style={{ width: "30%" }}>
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
                                            setErrors({});

                                        }
                                    }}
                                />
                            </div>
                            <div className="form-group" style={{ width: "30%" }}>
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
                                            setErrors({});

                                        }
                                    }}

                                />
                            </div>
                        </div>
                    </div> */}

                    {/* # sub form */}
                    <div className="d-flex w-100 flex-column gap-3 mt-4 justify-content-center">

                        {props.loading ?
                            (<div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>)
                            :
                            (<button type="submit" className="btn btn-primary"
                                tabIndex={13}
                                style={{
                                    fontSize: "1rem",
                                    padding: "0.75rem 0.75rem",
                                }}
                            >
                                Submit
                            </button>
                            )}
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

export default DoctorInfoForm;