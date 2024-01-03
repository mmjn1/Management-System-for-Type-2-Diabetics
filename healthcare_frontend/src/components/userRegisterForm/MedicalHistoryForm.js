import React, { useState } from "react";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { TextField } from "../formComponents/TextField";
import { RadioGroup } from "../formComponents/RadioGroup";

import * as Yup from "yup";


const MedicalHistoryValidationSchema = Yup.object().shape({

    medical_history: Yup.string()
        .required("Medical history is required")
        .label("Medical History"),

    insurance_information: Yup.string()
        .required("Insurance information is required")
        .label("Insurance Information"),
      
});


const MedicalHistoryForm = (props) => {
    const { error, isSubmitting, currentFormSubmitCount, loading } = props;
    const [errors, setErrors] = useState(error || {});

    const handleSubmit = (values) => {
        props.next(values, true);
    };

    // console.log("My loading status", loading);



    return (
        <Formik
            validationSchema={MedicalHistoryValidationSchema}
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
                            <h3 className="fs-5"> Medical Info</h3>
                        </div>
                        <div className="uni-section-group d-flex flex-column gap-1 justify-content-between">
                            <div className="form-group">
                                <TextField
                                    label="Medical History"
                                    name="medical_history"
                                    type="text"
                                    placeholder="Please provide any relevant medical history, particularly related to your diabetes."
                                    required={true}
                                    tabIndex={1}
                                    error={props.error.medical_history}
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
                                    label="Insurance Information"
                                    name="insurance_information"
                                    type="text"
                                    placeholder="Please provide details of your health insurance coverage for diabetes care"
                                    required={true}
                                    tabIndex={2}
                                    error={props.error.insurance_information}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.insurance_information) {
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

export default MedicalHistoryForm;