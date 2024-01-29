import React, { useState, Fragment } from "react";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Formik, Field } from "formik";

import "bootstrap/dist/css/bootstrap.min.css";
import { post } from "../../../utils/axios";
const stepsEnum = {
  1: "Basic Information",
  2: "Professtional Credentials and Experience",
  3: "Practice Details and Preferences",
};

const currentYear = new Date().getFullYear();
const phoneRegExp =
  /^\+?([0-9]{2,3})?\)?[-. ]?([0-9]{2,3})[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  first_name: Yup.string().required("First name is required"),
  middle_name: Yup.string(), // Assuming it's not required
  last_name: Yup.string().required("Last name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  speciality: Yup.string().required("Speciality is required"),
  years_of_experience: Yup.number()
    .positive("Years of experience must be a positive number")
    .integer("Years of experience must be an integer")
    .required("Years of experience is required"),
  medical_license_number: Yup.string().required(
    "Medical license number is required"
  ),
  country_of_issue: Yup.string().required("Country of issue is required"),
  year_of_issue: Yup.number()
    .min(currentYear - 100, `Year of issue cannot be more than 100 years ago`)
    .max(currentYear, `Year of issue cannot be in the future`)
    .required("Year of issue is required"),
  diabetes_management_experience: Yup.string().required(
    "Diabetes management experience is required"
  ),
  treatement_approach: Yup.string().required("Treatment approach is required"),
  contact_hours: Yup.string() // Add regex pattern if needed
    .required("Contact hours are required"),
  tel_number: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("Telephone number is required"),
  emergency_consultations: Yup.string().required(
    "Emergency consultations detail is required"
  ),
});

const DoctorForm = () => {
  //step: 1
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  //step: 2
  const [speciality, setSpeciality] = useState("");
  const [yearsOfExperience, setYearsOfExperience] = useState("");
  const [medicalLicenceNumber, setMedicalLicenceNumber] = useState("");
  const [countryOfIssue, setCountryOfIssue] = useState("");
  const [yearOfIssue, setYearOfIssue] = useState("");
  const [diabetesManagementExperience, setDiabetesManagementExperience] =
    useState("");
  //step: 3
  const [treatmentApproach, setTreatmentApproach] = useState("");
  const [contactHours, setContactHours] = useState("");
  const [communicationMethod, setCommunicationMethod] = useState("");
  const [telephoneNumber, setTelephoneNumber] = useState("");
  const [emergencyConsultations, setEmergencyConsultations] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  
  const handleRegister = () => {
    // Perform your registration logic here
    if (email && firstName && lastName && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
      } else {
        const data = {
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
          role: "doctor",
          speciality: speciality,
          years_of_experience: Number(yearsOfExperience),
          medical_license_number: medicalLicenceNumber,
          country_of_issue: countryOfIssue,
          year_of_issue: yearOfIssue,
          diabetes_management_experience: diabetesManagementExperience,
          treatement_approach: treatmentApproach,
          contact_hours: contactHours,
          communication_method_for_patient: communicationMethod,
          tel_number: telephoneNumber,
          emergency_consultations: emergencyConsultations,
        };
        post("/doctor/create/", data)
          .then((res) => {
            alert(`Registration successful!`);
          })
          .catch((err) => {
            alert(err.message);
          });
        setError("");

        // Replace with your actual registration logic
      }
    } else {
      setError("Please fill in all fields.");
    }
  };
  const handleNext = () => {
    if (step === 1 && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (step < 3) {
      setError("");
      setStep((prev) => prev + 1);
    }
  };
  const handlePrev = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };
  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">
          Registration - {stepsEnum[step]}
        </h2>
        <Formik
          validationSchema={validationSchema}
          // add next page function in onsubmit

          onSubmit={() => console.log("add any function")}
          initialValues={{
            email:'',
            first_name:'',
            last_name:'',
            password:'',
            confirmPassword:'',
            speciality:'',
            years_of_experience:'',
            medical_licence_number:'',
            country_of_issue:'',
            year_of_issue:'',
            diabetes_management_experience:'',
            treatment_approach:'',
            contact_hours:'',
            telephone_number:'',

          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Fragment>
              <Form noValidate onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email:
                      </label>
                      <Form.Control
                        type="email"
                        className="form-control"
                        placeholder="What is your email address?"
                        id="email"
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
                        First Name:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="first_name"
                        value={values.first_name}
                        onChange={handleChange}
                        isInvalid={!!errors.first_name}
                        placeholder="What is your first name?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                      </Form.Control.Feedback>

                    </div>
                    <div className="mb-3">
                      <label htmlFor="lastName" className="form-label">
                        Last Name:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="last_name"
                        value={values.last_name}
                        onChange={handleChange}
                        isInvalid={!!errors.last_name}
                        placeholder="What is your last name?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password:
                      </label>
                      <Form.Control
                        type="password"
                        className="form-control"
                        id="password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Please enter a password."
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password:
                      </label>
                      <Form.Control
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        placeholder="Please confirm your password."
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.confirmPassword}
                      </Form.Control.Feedback>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="speciality" className="form-label">
                        Speciality:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        placeholder="What is your medical speciality?"
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
                      <label htmlFor="years_ofExperience" className="form-label">
                        Years of Experience:
                      </label>
                      <Form.Control
                        type="number"
                        className="form-control"
                        id="years_of_experience"
                        value={values.years_of_experience}
                        onChange={handleChange}
                        isInvalid={!!errors.years_of_experience}
                        placeholder="How many years you have been practicing medicine?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.years_of_experience}
                      </Form.Control.Feedback>
                    </div>

                    <div className="mb-3">
                      <label
                        htmlFor="medicalLicenceNumber"
                        className="form-label"
                      >
                        Medical Licence Number:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="medical_licence_number"
                        value={values.medical_licence_number}
                        onChange={handleChange}
                        isInvalid={!!errors.medical_licence_number}
                        placeholder="Please provide your medical licence number"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.medical_licence_number}
                      </Form.Control.Feedback>
                    </div>


                    <div className="mb-3">
                      <label htmlFor="country_of_issue" className="form-label">
                        Country of Issue:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="country_of_issue"
                        value={values.country_of_issue}
                        onChange={handleChange}
                        isInvalid={!!errors.country_of_issue}
                        placeholder="In which country was your medical licence issued?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.country_of_issue}
                      </Form.Control.Feedback>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="year_of_issue" className="form-label">
                        Year of Issue:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="year_of_issue"
                        value={values.year_of_issue}
                        onChange={handleChange}
                        isInvalid={!!errors.year_of_issue}
                        placeholder="What year was your medical licence issued?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.year_of_issue}
                      </Form.Control.Feedback>
                    </div>


                    <div className="mb-3">
                      <label
                        htmlFor="diabetes_management_experience"
                        className="form-label"
                      >
                        Diabetes Management Experience:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="diabetesm_management_experience"
                        value={values.diabetes_management_experience}
                        onChange={handleChange
                        }
                        isInvalid={!!errors.diabetes_management_experience}
                        placeholder="Can you describe your experience in managing diabetes?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.diabetes_management_experience}
                      </Form.Control.Feedback>
      
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="treatment_approach" className="form-label">
                        Treatment Approach:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="treatment_approach"
                        value={values.treatment_approach}
                        onChange={handleChange}
                        isInvalid={!!errors.treatment_approach}
                        placeholder="What is your preferred treatment approach for type 2 diabetes?"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.treatment_approach}
                      </Form.Control.Feedback>  
                    </div>

                    <div className="mb-3">
                      <label htmlFor="contact_hours" className="form-label">
                        Contact Hours:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="contact_hours"
                        value={values.contact_hours}
                        onChange={handleChange}
                        placeholder="What are your available contact hours for patient consultation?"
                        isInvalid={!!errors.contact_hours}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.contact_hours}
                      </Form.Control.Feedback>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="telephone_number" className="form-label">
                        Telephone Number:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="telephone_number"
                        value={telephone_number}
                        onChange={handleChange}
                        placeholder="What is your contact telephone number?"
                        isInvalid={!!errors.telephone_number}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.telephone_number}
                      </Form.Control.Feedback>

                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="emergencyConsultations"
                        className="form-label"
                      >
                        Emergency Consultations:
                      </label>
                      <Form.Control
                        type="text"
                        className="form-control"
                        id="emergencyConsultations"
                        value={emergency_consultations}
                        onChange={handleChange}                        
                        placeholder="Are you available for emergency consultations? If yes, please describe the protocol."
                        isInvalid={!!errors.emergency_consultations}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.emergency_consulations}
                      </Form.Control.Feedback>
                    </div>
                  </>
                )}
                <div className="text-center">
                  {step !== 1 && (
                    <button
                      type="button"
                      className="btn btn-primary me-2 w-25"
                      onClick={handlePrev}
                    >
                      Prev
                    </button>
                  )}
                  <button
                  // function -> moved to line 143
                    // type="button"
                    className="btn btn-primary w-25"
                    type="submit"
                    // onClick={step === 3 ? handleRegister : handleNext}
                  >
                    {step === 3 ? "Register" : "Next"}
                  </button>
                </div>

                {error && <p className="text-danger mt-3">{error}</p>}
              </Form>
            </Fragment>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DoctorForm;
