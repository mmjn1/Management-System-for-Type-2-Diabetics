import React, { useState, Fragment, useEffect } from "react";
import Calendar from "react-calendar";
import * as Yup from "yup";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { post } from "../../../utils/axios";
import { registerUserPatient } from "../../../features/patient/patient_register";
import { fetchDoctor } from "../../../features/doctor/FetchDoctor";

const stepsEnum = {
  1: "Account Creation", 2: "Medical Background", 3: "Lifestyle and Emergency Details",
};

const validationSchema1 = Yup.object().shape({
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
  selectedDoctor: Yup.string().required("Select Doctor")
});

const validationSchema2 = Yup.object().shape({
  type_of_diabetes: Yup.string().required("Type of diabetes is required"),
  date_of_diagnosis: Yup.date().required("Date of diagnosis is required"),
  current_diabetes_medication: Yup.string().required("Current diabetes medication is required"),
  blood_sugar_level: Yup.number().required("Blood sugar level is required"),
  target_blood_sugar_level: Yup.number().required("Target blood sugar level is required"),
  medical_history: Yup.string().required("Medical history is required"),
  family_medical_history: Yup.string().required("Family medical history is required"),
  current_health_concerns: Yup.string().required("Current health concerns is required"),

});


const validationSchema3 = Yup.object().shape({

  dietary_habits: Yup.string().required("Dietary habits is required"),
  physical_activity_level: Yup.string().required("Physical activity level is required"),
  smoking_habits: Yup.string().required("Smoking habits is required"),
  alcohol_consumption: Yup.string().required("Alcohol consumption is required"),
  emergency_contact_information: Yup.string().required("Emergency contact information is required"),
  medication_adherence: Yup.string().required("Medication adherence is required"),

});
const PatientForm = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.DoctorSlice)
  useEffect(() => {
    dispatch(fetchDoctor())
  }, []);
  //step: 1
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [doctor, setDoctor] = useState("");

  //step: 2
  const [typeOfDiabetes, setTypeOfDiabetes] = useState("");
  const [dateOfDiagnosis, setDateOfDiagnosis] = useState("");
  const [currentDiabetesMedication, setCurrentDiabetesMedication] = useState("");
  const [bloodSugarLevel, setBloodSugarLevel] = useState("");
  const [targetBloodSugarLevel, setTargetBloodSugarLevel] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [currentHealthConcerns, setCurrentHealthConcerns] = useState("");

  const [step, setStep] = useState(1);

  const handleRegister = (values) => {
    const {
      dietary_habits,
      physical_activity_level,
      smoking_habits,
      alcohol_consumption,
      emergency_contact_information,
      medication_adherence
    } = values

    const data = {
      dietary_habits: dietary_habits,
      physical_activity_level: physical_activity_level,
      smoking_habits: smoking_habits,
      alcohol_consumption: alcohol_consumption,
      emergency_contact_information: emergency_contact_information,
      medication_adherence: medication_adherence,
      email: email,
      password: password,
      first_name: firstName,
      middle_name: middleName,
      last_name: lastName,
      role: "Patient",
      type_of_diabetes: typeOfDiabetes,
      date_of_diagnosis: dateOfDiagnosis,
      current_diabetes_medication: currentDiabetesMedication,
      blood_sugar_level: bloodSugarLevel,
      target_blood_sugar_level: targetBloodSugarLevel,
      medical_history: medicalHistory,
      family_medical_history: familyMedicalHistory,
      current_health_concerns: currentHealthConcerns,
      doctor: doctor,
    }
    dispatch(registerUserPatient(data))
  };
  const handleNext = (values) => {
    if (step === 1) {
      const { email, first_name, MiddleName, last_name, password, confirmPassword } = values
      setEmail(email)
      setFirstName(first_name)
      setMiddleName(MiddleName)
      setLastName(last_name)
      setPassword(password)
      setConfirmPassword(confirmPassword)
      setDoctor(values.selectedDoctor)
      setStep((prev) => prev + 1);
    } else if (step === 2) {
      const {
        type_of_diabetes,
        date_of_diagnosis,
        current_diabetes_medication,
        blood_sugar_level,
        target_blood_sugar_level,
        medical_history,
        family_medical_history,
        current_health_concerns,
      } = values

      setTypeOfDiabetes(type_of_diabetes)
      setDateOfDiagnosis(date_of_diagnosis)
      setCurrentDiabetesMedication(current_diabetes_medication)
      setBloodSugarLevel(blood_sugar_level)
      setTargetBloodSugarLevel(target_blood_sugar_level)
      setMedicalHistory(medical_history)
      setFamilyMedicalHistory(family_medical_history)
      setCurrentHealthConcerns(current_health_concerns)

      setStep((prev) => prev + 1);
    } else {

      setStep((prev) => prev + 1);
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
          email: '',
          first_name: '',
          MiddleName: '',
          last_name: '',
          password: '',
          confirmPassword: '',
          selectedDoctor: ''
        }}
      >
        {({
          handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
        }) => (<Form noValidate onSubmit={handleSubmit}>
          {step === 1 && (<>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                What is your email address?
              </label>
              <Form.Control
                type="email"
                className="form-control"
                id="email23"
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
                id="first_name22"
                name="first_name"
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
              <label htmlFor="middlename" className="form-label">
                What is your middle name?{" "}
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="MiddleName01"
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
                What is your last name?{" "}
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="last_name63"
                name="last_name"
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
                id="password96"
                placeholder="Please enter a password"
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
                Please re-enter your password.
              </label>
              <Form.Control
                type="password"
                className="form-control"
                id="confirmPassword101"
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

            <div className="mb-3">
              <label htmlFor="doctor" className="form-label">
                Please select a doctor from the list below to handle your
                diabetes management. You can find more information about our
                specialists on our Doctors page.
              </label>
              <Form.Control
                as="select"
                className="form-control"
                id="selectedDoctor"
                name="selectedDoctor"
                value={values.selectedDoctor}
                onChange={handleChange}
                isInvalid={!!errors.selectedDoctor}
                required
              >
                <option value="">Select a Doctor</option>
                {Array.isArray(doctors.data) && // Map over the doctors array and create an option for each doctor
                  doctors.data.map((doctor, index) => (<option key={index} value={doctor.id}>
                    Dr. {doctor.first_name} {doctor.last_name}
                  </option>))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {errors.selectedDoctor}
              </Form.Control.Feedback>
            </div>


            <div className="text-center">
              {step === 1 && (<button type="submit" className="btn btn-primary w-25">
                {step === 3 ? "Register" : "Next"}
              </button>)}

            </div>
          </>)}
        </Form>)}
      </Formik>

      <Formik
        validationSchema={validationSchema2}
        onSubmit={handleNext}
        initialValues={{
          type_of_diabetes: "",
          date_of_diagnosis: "",
          current_diabetes_medication: "",
          blood_sugar_level: "",
          target_blood_sugar_level: "",
          medical_history: "",
          family_medical_history: "",
          current_health_concerns: "",

        }}
      >
        {({
          handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
        }) => (<Form noValidate onSubmit={handleSubmit}>
          {step === 2 && (<>
            <div className="mb-3">
              <label htmlFor="typeOfDiabetes" className="form-label">
                Which type of diabetes have you been diagnosed with? (e.g., Type 1, Type 2, Gestational)
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="type_of_diabetes"
                name="type_of_diabetes"
                value={values.type_of_diabetes}
                onChange={handleChange}
                isInvalid={!!errors.type_of_diabetes}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.type_of_diabetes}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="dateOfDiagnosis" className="form-label">
                When were you diagnosed with diabetes?
              </label>
              <Calendar
                onChange={(e, event) => {
                  const formattedDate = e.toISOString().substring(0, 10); // Convert to YYYY-MM-DD format

                  handleChange({
                    ...event, target: {
                      name: "date_of_diagnosis", value: formattedDate
                    }
                  });
                }}
                value={values.dateOfDiagnosis}
                maxDate={new Date()}
              />
              {errors.date_of_diagnosis && touched.date_of_diagnosis && (<div style={{ color: "#dc3545" }}>
                {errors.date_of_diagnosis}
              </div>)}
            </div>
            <div className="mb-3">
              <label
                htmlFor="currentDiabetesMedication"
                className="form-label"
              >
                What medications are you currently taking for your diabetes? (e.g., Metformin, Insulin)
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                name="current_diabetes_medication"
                value={values.current_diabetes_medication}
                onChange={handleChange}
                isInvalid={!!errors.current_diabetes_medication}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.current_diabetes_medication}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="bloodSugarLevel" className="form-label">
                What is your most recent blood sugar level reading? (mg/dL)
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="blood_sugar_level"
                name="blood_sugar_level"
                value={values.blood_sugar_level}
                onChange={handleChange}
                isInvalid={!!errors.blood_sugar_level}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.blood_sugar_level}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="targetBloodSugarLevel" className="form-label">
                What is your target blood sugar level as advised by your
                healthcare provider? (mg/dL)
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="target_blood_sugar_level"
                name="target_blood_sugar_level"
                value={values.target_blood_sugar_level}
                onChange={handleChange}
                isInvalid={!!errors.target_blood_sugar_level}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.target_blood_sugar_level}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="medicalHistory" className="form-label">
                Please provide any additional medical history we should be
                aware of (e.g., heart disease, high blood pressure)
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                id="medicalHistory"
                name="medical_history"
                value={values.medical_history}
                onChange={handleChange}
                isInvalid={!!errors.medical_history}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.medical_history}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="family_medical_history" className="form-label">
                Has anyone in your family been diagnosed with diabetes? (e.g., mother with Type 2 diabetes) {" "}
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                id="family_medical_history"
                name="family_medical_history"
                value={values.family_medical_history}
                onChange={handleChange}
                isInvalid={!!errors.family_medical_history}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.family_medical_history}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="current_health_concerns" className="form-label">
                What are your current healthcare concerns? (e.g., frequent urination, thirst)
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                id="current_health_concerns"
                name="current_health_concerns"
                value={values.current_health_concerns}
                onChange={handleChange}
                placeholder="List any current health concerns or symptoms"
                isInvalid={!!errors.current_health_concerns}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.current_health_concerns}
              </Form.Control.Feedback>
            </div>
            <div className="text-center">
              <button type="button" className="btn btn-primary me-2 w-25" onClick={handlePrev}>
                Prev
              </button>
              <button type="submit" className="btn btn-primary w-25">
                Next
              </button>
            </div>
          </>)}


        </Form>)}
      </Formik>


      <Formik
        validationSchema={validationSchema3}
        onSubmit={handleRegister}
        initialValues={{
          dietary_habits: "",
          physical_activity_level: "",
          smoking_habits: "",
          alcohol_consumption: "",
          emergency_contact_information: "",
          medication_adherence: "",
        }}
      >
        {({
          handleSubmit, handleChange, handleBlur, values, touched, isValid, errors,
        }) => (<Form noValidate onSubmit={handleSubmit}>

          {step === 3 && (<>
            <div className="mb-3">
              <label htmlFor="dietary_habits" className="form-label">
                Can you describe your typical daily diet throughout the day?
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                id="dietary_habits"
                name="dietary_habits"
                value={values.dietary_habits}
                onChange={handleChange}
                isInvalid={!!errors.dietary_habits}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.dietary_habits}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="physical_activity_level" className="form-label">
                How would you describe your level of physical activity? (e.g., sedentary, light, moderate, vigorous)
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                id="physical_activity_level"
                name="physical_activity_level"
                value={values.physical_activity_level}
                onChange={handleChange}
                isInvalid={!!errors.physical_activity_level}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.physical_activity_level}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="smoking_habits" className="form-label">
                Do you smoke? If yes, how frequently? (e.g., non-smoker, occasional, daily)
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="smoking_habits"
                name="smoking_habits"
                value={values.smoking_habits}
                onChange={handleChange}
                isInvalid={!!errors.smoking_habits}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.smoking_habits}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="alcohol_consumption" className="form-label">
                Do you consume alcohol? If yes, how often and how much? (e.g., never, socially, daily, units per week)
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="alcohol_consumption"
                name="alcohol_consumption"
                value={values.alcohol_consumption}
                onChange={handleChange}
                isInvalid={!!errors.alcohol_consumption}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.alcohol_consumption}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label
                htmlFor="emergency_contact_information"
                className="form-label"
              >
                What is your emergency contact information? (e.g., name, relation, phone number)
              </label>
              <Form.Control
                type="text"
                className="form-control"
                id="emergency_contact_information"
                name="emergency_contact_information"
                value={values.emergency_contact_information}
                onChange={handleChange}
                isInvalid={!!errors.emergency_contact_information}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.emergency_contact_information}
              </Form.Control.Feedback>
            </div>
            <div className="mb-3">
              <label htmlFor="medicationAdherence" className="form-label">
                What is your medication adherence? (e.g., always, often, sometimes, never)
              </label>
              <Form.Control
                as="textarea"
                type="text"
                className="form-control"
                id="medication_adherence"
                name="medication_adherence"
                value={values.medication_adherence}
                onChange={handleChange}
                isInvalid={!!errors.medication_adherence}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.medication_adherence}
              </Form.Control.Feedback>
            </div>

            <div className="text-center">
              {step === 3 && (
                <button type="button" className="btn btn-primary me-2 w-25" onClick={handlePrev}>
                  Prev
                </button>)}
              <button type="submit" className="btn btn-primary w-25">
                Register
              </button>
            </div>
          </>)}

        </Form>)}
      </Formik>
    </div>
  </div>);
};

export default PatientForm;