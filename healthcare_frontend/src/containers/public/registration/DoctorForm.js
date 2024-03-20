import React, { useState, Fragment } from "react";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Formik, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import { post } from "../../../utils/axios";

import { registerDoctor } from "../../../features/doctor/doctor_register";

const stepsEnum = {
    1: "Basic Information", 2: "Professional Credentials and Experience", 3: "Practice Details and Preferences",
};

const currentYear = new Date().getFullYear();
const phoneRegExp = /^\+?([0-9]{2,3})?\)?[-. ]?([0-9]{2,3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const validationSchema1 = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    first_name: Yup.string()
        .required("First name is required"),
    last_name: Yup.string()
        .required("Last name is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

const validationSchema2 = Yup.object().shape({
    speciality: Yup.string().required("Speciality is required"),
    years_of_experience: Yup.number()
        .positive("Years of experience must be a positive number")
        .integer("Years of experience must be an integer")
        .required("Years of experience is required"),
    medical_licence_number: Yup.string()
        .required("Medical license number is required"),
    //country_of_issue: Yup.string().required("Country of issue is required"),
    year_of_issue: Yup.number()
        .min(currentYear - 100, `Year of issue cannot be more than 100 years ago`)
        .max(currentYear, `Year of issue cannot be in the future`)
        .required("Year of issue is required"),
    diabetes_management_experience: Yup.string()
        .required("Diabetes management experience is required"),
});

const validationSchema3 = Yup.object().shape({
    treatment_approach: Yup.string().required("Treatment approach is required"),
    contact_hours: Yup.string()
        .required("Contact hours are required"),
    telephone_number: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .required("Telephone number is required"),
    emergency_consultations: Yup.string().required("Emergency consultations detail is required"),
});

const DoctorForm = () => {
    const dispatch = useDispatch();
    // const doctorResgister=useSelector((state)=>state)

    //step: 1
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [middleName, setMiddleName] = useState("")
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    //step: 2
    const [speciality, setSpeciality] = useState("");
    const [yearsOfExperience, setYearsOfExperience] = useState("");
    const [medicalLicenceNumber, setMedicalLicenceNumber] = useState("");
    //const [countryOfIssue, setCountryOfIssue] = useState("");
    const [yearOfIssue, setYearOfIssue] = useState("");
    const [diabetesManagementExperience, setDiabetesManagementExperience] = useState("");

    const [step, setStep] = useState(1);

    const handleRegister = (values) => {
        const { treatment_approach, contact_hours, telephone_number, emergency_consultations } = values;

        const data = {
            email: email,
            password: password,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            role: "Doctor",
            speciality: speciality,
            years_of_experience: Number(yearsOfExperience),
            medical_license_number: medicalLicenceNumber,
            //country_of_issue: countryOfIssue,
            year_of_issue: yearOfIssue,
            diabetes_management_experience: diabetesManagementExperience,
            treatment_approach: treatment_approach,
            contact_hours: contact_hours,
            tel_number: telephone_number,
            emergency_consultations: emergency_consultations,
        };
        dispatch(registerDoctor(data));
    };

    const handleNext = (values) => {
        if (step === 1) {
            const { email, first_name, MiddleName, last_name, password, confirmPassword } = values;
            setEmail(email);
            setFirstName(first_name);
            setMiddleName(MiddleName);
            setLastName(last_name);
            setPassword(password);
            setConfirmPassword(confirmPassword);
            setStep((prev) => prev + 1);
        } else if (step === 2) {
            const {
                speciality,
                years_of_experience,
                medical_licence_number,
                //country_of_issue,
                year_of_issue,
                diabetes_management_experience
            } = values;
            setSpeciality(speciality);
            setYearsOfExperience(years_of_experience);
            setMedicalLicenceNumber(medical_licence_number);
            //setCountryOfIssue(country_of_issue);
            setYearOfIssue(year_of_issue);
            setDiabetesManagementExperience(diabetes_management_experience);
            setStep((prev) => prev + 1);
        } else if (step === 3) {
            // const { treatment_approach, contact_hours, telephone_number, emergency_consultations } = values;
            // setTreatmentApproach(treatment_approach);
            // setContactHours(contact_hours);
            // setTelephoneNumber(telephone_number);
            // setEmergencyConsultations(emergency_consultations);
            handleRegister(values);
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep((prev) => prev - 1);
        }
    };
    return (<div className="card">
        <div className="card-body">
            <h2 className="card-title text-center mb-4">
                Registration - {stepsEnum[step]}
            </h2>
            <Formik
                validationSchema={validationSchema1}
                onSubmit={handleNext}
                initialValues={{
                    email: '', first_name: '', MiddleName: '', last_name: '', password: '', confirmPassword: '',
                }}
            >
                {({
                    handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
                }) => (<Fragment>
                    <Form noValidate onSubmit={handleSubmit}>
                        {step === 1 && (<>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">
                                    What is your email address?
                                </label>
                                <Form.Control
                                    type="email"
                                    className="form-control"
                                    id="email-101"
                                    name="email"
                                    value={values.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">
                                    What is your first name?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="first_name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.first_name}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.first_name}
                                </Form.Control.Feedback>

                            </div>
                            <div className="mb-3">
                                <label htmlFor="MiddleName" className="form-label">
                                    What is your middle name?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="MiddleName"
                                    name="MiddleName"
                                    value={values.MiddleName}
                                    onChange={handleChange}
                                    isInvalid={!!errors.MiddleName}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.MiddleName}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">
                                    What is your last name?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="last_name"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    isInvalid={!!errors.last_name}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.last_name}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">
                                    Please enter a password.
                                </label>
                                <Form.Control
                                    type="password"
                                    className="form-control"
                                    id="password-1"
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Please confirm your password.
                                </label>
                                <Form.Control
                                    type="password"
                                    className="form-control"
                                    id="confirmPassword-1"
                                    name="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.confirmPassword}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.confirmPassword}
                                </Form.Control.Feedback>
                            </div>
                        </>)}

                        <div className="text-center">
                            {step === 1 && (<button
                                type="submit"
                                className="btn btn-primary me-2 w-25"
                                onClick={handlePrev}
                            >
                                Next
                            </button>)}
                        </div>
                    </Form>
                </Fragment>)}
            </Formik>

            {/*Step 2*/}
            <Formik
                validationSchema={validationSchema2}
                onSubmit={handleNext}
                initialValues={{
                    speciality: '',
                    years_of_experience: '',
                    medical_licence_number: '',
                    //country_of_issue: '',
                    year_of_issue: '',
                    diabetes_management_experience: '',
                }}
            >
                {({
                    handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
                }) => (<Fragment>
                    <Form noValidate onSubmit={handleSubmit}>
                        {step === 2 && (<>
                            <div className="mb-3">
                                <label htmlFor="speciality" className="form-label">
                                    What area of diabetes do you specialise in?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="speciality"
                                    value={values.speciality}
                                    onChange={handleChange}
                                    isInvalid={!!errors.speciality}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.speciality}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="years_of_experience" className="form-label">
                                    How many years have you been practicing medicine?
                                </label>
                                <Form.Control
                                    type="number"
                                    className="form-control"
                                    id="years_of_experience"
                                    value={values.years_of_experience}
                                    onChange={handleChange}
                                    isInvalid={!!errors.years_of_experience}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.years_of_experience}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="medical_licence_number"
                                    className="form-label"
                                >
                                    Please enter your GMC-issued medical licence number.
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="medical_licence_number"
                                    name='medical_licence_number'
                                    value={values.medical_licence_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.medical_licence_number}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.medical_licence_number}
                                </Form.Control.Feedback>
                            </div>
                            {/* <div className="mb-3">
                                <label htmlFor="country_of_issue" className="form-label">
                                    In which country was your medical licence issued?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="country_of_issue"
                                    value={values.country_of_issue}
                                    onChange={handleChange}
                                    isInvalid={!!errors.country_of_issue}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.country_of_issue}
                                </Form.Control.Feedback>
                            </div> */}
                            <div className="mb-3">
                                <label htmlFor="year_of_issue" className="form-label">
                                    What year was your medical licence issued?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="year_of_issue"
                                    value={values.year_of_issue}
                                    onChange={handleChange}
                                    isInvalid={!!errors.year_of_issue}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.year_of_issue}
                                </Form.Control.Feedback>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="diabetes_management_experience" className="form-label">
                                    Can you describe your experience in managing diabetes?
                                </label>
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    className="form-control"
                                    id="diabetes_management_experience"
                                    name='diabetes_management_experience'
                                    value={values.diabetes_management_experience}
                                    onChange={handleChange}
                                    isInvalid={!!errors.diabetes_management_experience}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.diabetes_management_experience}
                                </Form.Control.Feedback>

                            </div>
                        </>)}


                        <div className="text-center">
                            {step === 2 && (<Fragment>
                                <button type="button" className="btn btn-primary me-2 w-25" onClick={handlePrev}>
                                    Prev
                                </button>
                                <button className="btn btn-primary w-25" type="submit">
                                    {step === 3 ? "Register" : "Next"}
                                </button>
                            </Fragment>)}
                        </div>
                    </Form>
                </Fragment>)}
            </Formik>

            {/*Step 3*/}
            <Formik
                validationSchema={validationSchema3}
                onSubmit={handleNext}
                initialValues={{
                    treatment_approach: '', contact_hours: '', telephone_number: '', emergency_consultations: '',
                }}
            >
                {({
                    handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
                }) => (<Fragment>
                    <Form noValidate onSubmit={handleSubmit}>

                        {step === 3 && (<>
                            <div className="mb-3">
                                <label htmlFor="treatment_approach" className="form-label">
                                    What is your preferred treatment approach for type 2 diabetes?
                                </label>
                                <Form.Control
                                    as="textarea"
                                    type="text"
                                    className="form-control"
                                    id="treatment_approach"
                                    name='treatment_approach'
                                    value={values.treatment_approach}
                                    onChange={handleChange}
                                    isInvalid={!!errors.treatment_approach}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.treatment_approach}
                                </Form.Control.Feedback>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="contact_hours" className="form-label">
                                    What are your available contact hours for patient consultation?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="contact_hours"
                                    name='contact_hours'
                                    value={values.contact_hours}
                                    onChange={handleChange}
                                    isInvalid={!!errors.contact_hours}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.contact_hours}
                                </Form.Control.Feedback>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="telephone_number" className="form-label">
                                    What is your contact telephone number?
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="telephone_number"
                                    name='telephone_number'
                                    value={values.telephone_number}
                                    onChange={handleChange}
                                    isInvalid={!!errors.telephone_number}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.telephone_number}
                                </Form.Control.Feedback>

                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="emergency_consultations"
                                    className="form-label"
                                >
                                    Are you available for emergency consultations? If yes, please describe the protocol.
                                </label>
                                <Form.Control
                                    type="text"
                                    className="form-control"
                                    id="emergency_consultations"
                                    value={values.emergency_consultations}
                                    onChange={handleChange}
                                    name='emergency_consultations'
                                    isInvalid={!!errors.emergency_consultations}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.emergency_consultations}
                                </Form.Control.Feedback>
                            </div>
                        </>)}

                        <div className="text-center">
                            {step === 3 && (<Fragment>
                                <button type="button" className="btn btn-primary me-2 w-25" onClick={handlePrev}>
                                    Prev
                                </button>
                                <button className="btn btn-primary w-25" type="submit">
                                    {step === 3 ? "Register" : "Next"}
                                </button>
                            </Fragment>)}
                        </div>
                    </Form>
                </Fragment>)}
            </Formik>

        </div>
    </div>);
};

export default DoctorForm;