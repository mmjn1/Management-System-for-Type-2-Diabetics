import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField } from "../formComponents/TextField";
import * as Yup from "yup";

const ProfileFormValidationSchema = Yup.object({
    

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

    target_blood_sugar_level: Yup.number()
        .required("Target blood sugar level is required")
        .min(0, "Target blood sugar level must be a positive number")
        .label("Target Blood Sugar Level"),

    dietary_habits: Yup.string()
        .required("Dietary habits are required")
        .label("Dietary Habits"),

    physical_activity_level: Yup.string()
        .required("Physical activity level is required")
        .label("Physical Activity Level"),

    smoking_habits: Yup.string()
        .required("Smoking habits are required")
        .label("Smoking Habits"),

    alcohol_consumption: Yup.string()
        .required("Alcohol consumption is required")
        .label("Alcohol Consumption"),
 
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
                            <h3 className="fs-5"> Diabetes Information</h3>
                        </div>
                        <div className=" name-section-group d-flex gap-md-2 gap-sm-2 justify-content-between flex-md-row flex-column">
                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Type of Diabetes"
                                    name="type_of_diabetes"
                                    required={true}
                                    tabIndex={1}
                                    type="text"
                                    placeholder="Which type of diabetes have you been disagnoised with (e.g. Type 1, Type 2, Gestational, Other)?)"
                                    error={props.error.type_of_diabetes}
                                    currentSubmitCount={currentFormSubmitCount}
                                    // className="p-inputtext p-component p-text-input w-100"

                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.type_of_diabetes) {
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
                                    label="Date of Diagnosis"
                                    name="date_of_diagnosis"
                                    required={false}
                                    type="text"
                                    placeholder="When were you diagnosed with diabetes?"
                                    tabIndex={2}
                                    error={props.error.date_of_diagnosis}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.date_of_diagnosis) {
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
                                    label="Medications"
                                    required={true}
                                    tabIndex={3}
                                    name="current_diabetes_medication"
                                    type="text"
                                    placeholder="What medications are you currently taking?"
                                    error={props.error.current_diabetes_medication}
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

                    <div className="address-section">
                        <div className="header lead d-flex gap-2 align-items-center">
                            <h3 className="fs-5"> Glucose Levels and Lifestyle</h3>
                        </div>
                        <div className=" address-section-group d-flex flex-column">
                            <div className="half-address-section d-flex gap-md-2 gap-sm-2  gap-2 justify-content-between flex-md-row flex-column">
                                <div className="form-group col-md-4"
                                // style={{ width: "30%" }}
                                >
                                    <TextField
                                        label="Blood Sugar Level"
                                        required={true}
                                        tabIndex={4}
                                        name="blood_sugar_level"
                                        type="text"
                                        placeholder="What was your most recent blood sugar level reading (mg/dL or mmol/L)?"
                                        error={props.error.blood_sugar_level}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.blood_sugar_level) {
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
                                        label="Target Blood Sugar Level"
                                        name="target_blood_sugar_level"
                                        required={false}
                                        tabIndex={5}
                                        type="text"
                                        placeholder="What is your target blood sugar level set by doctor (mg/dL or mmol/L)?"
                                        error={props.error.target_blood_sugar_level}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.target_blood_sugar_level) {
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
                                        label="Dietary Habits"
                                        required={true}
                                        tabIndex={6}
                                        name="dietary_habits"
                                        type="text"
                                        placeholder="Describe your dietary habits (e.g. low carb, low fat, vegan, etc.)"
                                        error={props.error.dietary_habits}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.dietary_habits) {
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
                                        label="Physical Activity Level"
                                        name="physical_activity_level"
                                        type="text"
                                        placeholder="Describe your physical activity level (e.g. sedentary, light, moderate, heavy, etc.)"
                                        required={false}
                                        tabIndex={7}
                                        error={props.error.physical_activity_level}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.physical_activity_level) {
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
                                        label="Smoking Habits"
                                        name="smoking_habits"
                                        tabIndex={8}
                                        required={true}
                                        type="text"
                                        placeholder="Do you smoke? If so, how often"
                                        error={props.error.smoking_habits}
                                        currentSubmitCount={currentFormSubmitCount}
                                        onChange={(e) => {
                                            handleChange(e);
                                            // check the field error and reset error from the error object
                                            if (props.error.smoking_habits) {
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
                                        label="Alcohol Consumption"
                                        name="alchohol_consumption"
                                        required={true}
                                        tabIndex={9}
                                        type="text"
                                        placeholder="How frequently do you consume alcohol, and what are the typical quantities?"
                                        error={props.error.alcohol_consumption}
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