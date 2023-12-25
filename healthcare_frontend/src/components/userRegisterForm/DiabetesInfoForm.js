import React, { useState } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { TextField } from "../formComponents/TextField";
import { RadioGroup } from "../formComponents/RadioGroup";

import * as Yup from "yup";


const AdditionalInfoValidationSchema = Yup.object().shape({

    // is_international: Yup.boolean()
    //     .required("International student is required")
    //     .label("International student"),

    smoking_habits: Yup.string()
        .required("Smoking habits are required")
        .label("Smoking Habits"),

    alcohol_consumption: Yup.string()
        .required("Alcohol consumption is required")
        .label("Alcohol Consumption"),
    
    method_of_contact: Yup.string()
        .oneOf(["text", "email"], "Method of contact is required")
        .required("Please select your preferred method of contact")
        .label("Method of Contact"),


    
});




// const isInternationalOptions = [
//     { value: "true", label: "Yes", tabIndex: 3 },
//     { value: "false", label: "No", tabIndex: 4 },
// ];

// const isInternationalOptions_for_primeComponent = [
//     { key: 'Yes', value: 'true' },
//     { key: 'No', value: 'false' },
// ];



const isMethodofContact = [
    { value: "SMS", label: "SMS", tabIndex: 3 },
    { value: "Email", label: "Email", tabIndex: 4 },
];

const isMethodofContact_for_primeComponent = [
    { key: 'SMS', value: 'true' },
    { key: 'Email', value: 'Email' },
];


const DiabetesInfoForm = (props) => {
    const { error, isSubmitting, currentFormSubmitCount, loading } = props;
    const [errors, setErrors] = useState(error || {});

    const handleSubmit = (values) => {
        props.next(values, true);
    };

    // console.log("My loading status", loading);



    return (
        <Formik
            validationSchema={AdditionalInfoValidationSchema}
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
                <Form className="d-flex flex-column gap-1 col-md-7 mx-auto">

                    <div className="uni-section">
                        <div className="header lead">
                            <h3 className="fs-5">Your University Details</h3>
                        </div>
                        <div className="uni-section-group d-flex flex-column gap-1 justify-content-between">
                            <div className="form-group">
                                <TextField
                                    label="Course Name"
                                    name="course_name"
                                    type="text"
                                    required={true}
                                    tabIndex={1}
                                    error={props.error.course_name}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.course_name) {
                                            props.setErrors({});
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

                            <div className="form-group">
                                <TextField
                                    label="School of Study"
                                    name="school_of_study"
                                    type="text"
                                    required={true}
                                    tabIndex={2}
                                    error={props.error.school_of_study}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.school_of_study) {
                                            props.setErrors({});
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

                    <div className="form-group mb-4">
                        <div className=" gap-3">
                            <div className="d-block">
                                <label className="form-check-label" htmlFor="method_of_contact">
                                    What is your preferred method of contact to recieve reminders from us? <span className="text-danger">*</span>
                                </label>
                            </div>
                            <div className="d-flex flex-row my-1 gap-4">
                                {isMethodofContact.map((option) => (
                                    <div className="d-flex flex-row my-1 gap-2" >
                                        <Field
                                            type="radio"
                                            name="method_of_contact"
                                            value={option.value}
                                            id="method_of_contact"
                                            className="form-check-input"
                                            tabIndex={option.tabIndex}
                                            checked={
                                                String(values.method_of_contact) === option.value
                                            }
                                        />

                                        <label
                                            className="form-check-label"
                                            key={option.value}
                                            htmlFor="method_of_contact"
                                        >
                                            {option.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <ErrorMessage
                                name="method_of_contact"
                                component="div"
                                className="error"
                            />
                        </div>
                        <RadioGroup
                            label="What is your preferred method of contact?"
                            name="method_of_contact"
                            options={isMethodofContact_for_primeComponent}
                            required={true}
                            stacked={true}
                            tabIndex={3}
                            error={props.error.method_of_contact}
                            // currentSubmitCount={currentFormSubmitCount}
                            value={values.method_of_contact}
                            onChange={(e) => {
                                handleChange(e);
                                // check the field error and reset error from the error object
                                if (props.error.method_of_contact) {
                                    props.setErrors({});
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


                    <div className="d-flex w-100 flex-column gap-3 mt-3">

                        {props.loading ?
                            (<div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>)
                            :
                            (<button type="submit" className="btn btn-primary"
                                tabIndex={6}
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
                            className="btn btn-outline-primary"
                            tabIndex={5}
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

export default DiabetesInfoForm;