import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TextField } from "components/formComponents/TextField";
import * as Yup from "yup";




// Formating mobile/phone number and showing it in the input field
function formatPhoneNumber(phoneNumber) {
    // check if phone number starts with a plus sign followed by digits
    const countryCodeMatch = phoneNumber.match(/^\+(\d{1,3})/);
    if (countryCodeMatch) {
        const countryCode = countryCodeMatch[1];
        const phoneNumberDigits = phoneNumber.substr(countryCodeMatch[0].length);
        console.log(`Country code: ${countryCode}, Phone number: ${phoneNumberDigits}`);
        return `(${countryCode}) ${phoneNumberDigits}`;
    } else {
        // no country code found, just return the phone number
        return phoneNumber;
    }
}


// Define a custom phone number validation function
const ProfileFormValidationSchema = Yup.object({
    first_name: Yup.string()
        // .required("First name is required")
        .required("First name is required")
        // .notRequired()
        .matches(/^[a-zA-Z]+$/, "First name must be only letters")
        .label("First name"),
    middle_name: Yup.string()
        .notRequired()
        .matches(/^[a-zA-Z]+$/, "Middle name must be only letters")
        .label("Middle name"),

    last_name: Yup.string()
        .required("Last name is required")
        .matches(/^[a-zA-Z]+$/, "Last name must be only letters")
        .label("Last name"),

    tel_number: Yup.string()
        .required("Telephone number is required")
        // # get the regex for phone with country code from here
        .matches(
            /^(\+\d{1,3})?\d{8,10}$/,
            "Please enter a valid phone number"
        )
        .label("Telephone number")
        .max(15, "Phone number is too long")
        .min(10, "Phone number is too short"),

    communication_method_for_patients: Yup.string()
        .required("Communication method is required")
        .label("Communication method for patients"),

    emergency_consulations: Yup.string()
        .required("Emergency consulations is required")
        .label("Emergency consulations"),
});




const DoctorProfileForm = (props) => {
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
            {({ values, handleChange, meta }) => (
                <Form className="d-flex flex-column">
                    <h2 className="text-start fs-4">Main contact person</h2>

                    <div className="name-section">
                        <div className="header lead">
                            <h3 className="fs-5">Full name</h3>
                        </div>
                        <div className="  name-section-group d-flex gap-md-2 gap-sm-2 justify-content-between flex-md-row flex-column">

                            <div className="form-group col-md-4"
                            // style={

                            //     {
                            //         width: smallScreen ? "100%" : "30%"
                            //     }
                            // }
                            >
                                <TextField
                                    label="First Name"
                                    name="first_name"
                                    required={true}
                                    tabIndex={1}
                                    type="text"
                                    error={props.error.first_name}
                                    currentSubmitCount={currentFormSubmitCount}
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
                    <div className="form-group col-md-4"
                    // style={{ width: "30%" }}
                    >

                        <TextField
                            label="Preferred method communication with patients (e.g. Phone, Email, or Messaging app)"
                            required={true}
                            name="communication_method_for_patients"
                            type="text"
                            tabIndex={4}
                            error={props.error.communication_method_for_patients}
                            currentSubmitCount={currentFormSubmitCount}
                            onChange={(e) => {
                                handleChange(e);
                                // check the field error and reset error from the error object
                                if (props.error.communication_method_for_patients) {
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

                    <div className="contact-section">
                        <div className="header lead">
                            <h3 className="fs-5"> Additional details</h3>
                        </div>
                        <div className=" contact-section-group d-flex gap-md-2 gap-sm-2  gap-2 justify-content-between flex-md-row flex-column ">

                            <div className="form-group col-md-4"
                            // style={{ width: "30%" }}
                            >
                                <TextField
                                    label="Contact Telephone Number"
                                    required={true}
                                    name="tel_number"
                                    type="text"
                                    tabIndex={5}
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
                                    label="Are you available for emergency consulations?"
                                    name="emergency_consulations"
                                    type="text"
                                    required={true}
                                    tabIndex={6}
                                    error={props.error.emergency_consulations}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.emergency_consulations) {
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
                                    label="Contact Person Email"
                                    name="contact_person_email"
                                    type="email"
                                    tabIndex={7}
                                    required={true}
                                    error={props.error.contact_person_email}
                                    currentSubmitCount={currentFormSubmitCount}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // check the field error and reset error from the error object
                                        if (props.error.contact_person_email) {
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

                    {/* # sub form */}
                    <div className="d-flex w-100 flex-column col-md-2 gap-md-2 gap-2 mt-4 mt-md-5 md-sm-4"
                    >

                        <button
                            type="submit"
                            className="btn btn-primary"
                            tabIndex={8}
                            style={{
                                fontSize: "1rem",
                                padding: "0.75rem 0.75rem",
                            }}
                        >
                            Next
                        </button>
                        <button
                            type="button"
                            tabIndex={9}
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

export default DoctorProfileForm;