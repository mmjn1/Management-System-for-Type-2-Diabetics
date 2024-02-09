import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import * as Yup from "yup";
import { Formik, Field } from "formik";

import "react-calendar/dist/Calendar.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "../../../assets/glucocare/vendor/bootstrap/css/bootstrap.min.css";

import { post } from "../../../utils/axios";
const stepsEnum = {
  1: "Account Creation",
  2: "Medical Background",
  3: "Lifestyle and Emergency Details",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  type_of_diabetes: Yup.string().required("Type of diabetes is required"),
  date_of_diagnosis: Yup.date().required("Date of diagnosis is required"),
  current_diabetes_medication: Yup.string().required(
    "Current diabetes medication is required"
  ),
  blood_sugar_level: Yup.number().required("Blood sugar level is required"),
  target_blood_sugar_level: Yup.number().required(
    "Target blood sugar level is required"
  ),
  medical_history: Yup.string().required("Medical history is required"),
  family_medical_history: Yup.string().required(
    "Family medical history is required"
  ),
  current_health_concerns: Yup.string().required(
    "Current health concerns is required"
  ),
  dietary_habits: Yup.string().required("Dietary habits is required"),
  physical_activity_level: Yup.string().required(
    "Physical activity level is required"
  ),
  smoking_habits: Yup.string().required("Smoking habits is required"),
  alcohol_consumption: Yup.string().required("Alcohol consumption is required"),
  emergency_contact_information: Yup.string().required(
    "Emergency contact information is required"
  ),
  medication_adherence: Yup.string().required(
    "Medication adherence is required"
  ),
});

const PatientForm = () => {
  //step: 1
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [doctors, setDoctors] = useState([]);

  //step: 2
  const [typeOfDiabetes, setTypeOfDiabetes] = useState("");
  const [dateOfDiagnosis, setDateOfDiagnosis] = useState("");
  const [currentDiabetesMedication, setCurrentDiabetesMedication] =
    useState("");
  const [bloodSugarLevel, setBloodSugarLevel] = useState("");
  const [targetBloodSugarLevel, setTargetBloodSugarLevel] = useState("");
  const [medicalHistory, setMedicalHistory] = useState("");
  const [familyMedicalHistory, setFamilyMedicalHistory] = useState("");
  const [currentHealthConcerns, setCurrentHealthConcerns] = useState("");

  //step: 3
  const [dietaryHabits, setDietaryHabits] = useState("");
  const [physicalActivityLevel, setPhysicalActivityLevel] = useState("");
  const [smokingHabits, setSmokingHabits] = useState("");
  const [alcoholConsumption, setAlcoholConsumption] = useState("");
  const [emergencyContactInformation, setEmergencyContactInformation] =
    useState("");
  const [medicationAdherence, setMedicationAdherence] = useState("");

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

  // Fetch doctors when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/api/doctors");
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };

    fetchDoctors();
  }, []);

  const handleRegister = () => {
    // registration logic
    if (email && firstName && lastName && password && confirmPassword) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
      } else {
        setError("");
        const data = {
          email: email,
          password: password,
          first_name: firstName,
          last_name: lastName,
          role: "patient",
          type_of_diabetes: typeOfDiabetes,
          date_of_diagnosis: JSON.stringify(dateOfDiagnosis)
            .split("T")[0]
            .replace('"', ""),
          current_diabetes_medication: currentDiabetesMedication,
          blood_sugar_level: bloodSugarLevel,
          medical_history: medicalHistory,
          dietary_habits: dietaryHabits,
          physical_activity_level: physicalActivityLevel,
          smoking_habits: smokingHabits,
          alcohol_consumption: alcoholConsumption,
        };
        post("/patient/create/", data)
          .then((res) => {
            alert(`Registration successful!`);
          })
          .catch((err) => {
            alert(err.message);
          });
        setError("");
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

        <form>
          {step === 1 && (
            <>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  What is your email address?
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="example@domain.com"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="firstName" className="form-label">
                  What is your first name?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="lastName" className="form-label">
                  What is your last name?{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Doe"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Please enter a password.
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a Password"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Please confirm your password.
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                />
              </div>

              {/* Dropdown selection for Doctors */}
              <div className="mb-3">
                <label htmlFor="doctor" className="form-label">
                  Please select a doctor from the list below to handle your
                  diabetes management. You can find more information about our
                  specialists on our Doctors page.
                </label>
                <select
                  className="form-control"
                  id="doctor"
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)} // Update state when an option is selected
                  required
                >
                  <option value="">Select a Doctor</option>
                  {Array.isArray(doctors) &&
                    // Map over the doctors array and create an option for each doctor
                    doctors.map((doctor, index) => (
                      <option key={index} value={doctor.id}>
                        Dr. {doctor.first_name}  <br />
                        {doctor.last_name}
                        

                 


                      </option>
                    ))}
                </select>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div className="mb-3">
                <label htmlFor="typeOfDiabetes" className="form-label">
                  Which type of diabetes have you been diagnosed with?
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type of Diabetes:"
                  id="typeOfDiabetes"
                  value={typeOfDiabetes}
                  onChange={(e) => setTypeOfDiabetes(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dateOfDiagnosis" className="form-label">
                  When were you diagnosed with diabetes?
                </label>
                <Calendar
                  onChange={setDateOfDiagnosis}
                  value={dateOfDiagnosis}
                  maxDate={new Date()}
                />

                {/* <input
                  type="text"
                  className="form-control"
                  id="dateOfDiagnosis"
                  value={dateOfDiagnosis}
                  onChange={(e) => setDateOfDiagnosis(e.target.value)}
                  placeholder="When were you diagnosed with diabetes?"
                  required
                /> */}
              </div>
              <div className="mb-3">
                <label
                  htmlFor="currentDiabetesMedication"
                  className="form-label"
                >
                  What medications are you currently taking for your diabetes?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="currentDiabetesMedication"
                  value={currentDiabetesMedication}
                  onChange={(e) => setCurrentDiabetesMedication(e.target.value)}
                  placeholder="Current Diabetes Medication:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="bloodSugarLevel" className="form-label">
                  What is your most recent blood sugar level reading?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="bloodSugarLevel"
                  value={bloodSugarLevel}
                  onChange={(e) => setBloodSugarLevel(e.target.value)}
                  placeholder="Blood Sugar Level:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="targetBloodSugarLevel" className="form-label">
                  What is your target blood sugar level as advised by your
                  healthcare provider?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="targetBloodSugarLevel"
                  value={targetBloodSugarLevel}
                  onChange={(e) => setTargetBloodSugarLevel(e.target.value)}
                  placeholder="Target Blood Sugar Level:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="medicalHistory" className="form-label">
                  Please provide any additional medical history we should be
                  aware of
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="medicalHistory"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="Medical History:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="familyMedicalHistory" className="form-label">
                  Has anyone in your family been diagnosed with diabetes?{" "}
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="familyMedicalHistory"
                  value={familyMedicalHistory}
                  onChange={(e) => setFamilyMedicalHistory(e.target.value)}
                  placeholder="Family Medical History:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="currentHealthConcerns" className="form-label">
                  What are your current healthcare concerns?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="currentHealthConcerns"
                  value={currentHealthConcerns}
                  onChange={(e) => setCurrentHealthConcerns(e.target.value)}
                  placeholder="Current Health Concerns:"
                  required
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-3">
                <label htmlFor="dietaryHabits" className="form-label">
                  Can you describe your typical daily diet?
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dietary Habits:"
                  id="dietaryHabits"
                  value={dietaryHabits}
                  onChange={(e) => setDietaryHabits(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="physicalActivityLevel" className="form-label">
                  How would you describe your level of physical activity?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="physicalActivityLevel"
                  value={physicalActivityLevel}
                  onChange={(e) => setPhysicalActivityLevel(e.target.value)}
                  placeholder="Physical Activity Level:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="smokingHabits" className="form-label">
                  Do you smoke? If yes, how frequently?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="smokingHabits"
                  value={smokingHabits}
                  onChange={(e) => setSmokingHabits(e.target.value)}
                  placeholder="Smoking Habits:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="alcoholConsumption" className="form-label">
                  Do you consume alcohol? If yes, how often and how much?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="alcoholConsumption"
                  value={alcoholConsumption}
                  onChange={(e) => setAlcoholConsumption(e.target.value)}
                  placeholder="Alcohol Consumption:"
                  required
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="emergencyContactInformation"
                  className="form-label"
                >
                  What is your emergency contact information?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="emergencyContactInformation"
                  value={emergencyContactInformation}
                  onChange={(e) =>
                    setEmergencyContactInformation(e.target.value)
                  }
                  placeholder="Emergency Contact Information:"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="medicationAdherence" className="form-label">
                  What is your medication adherence?
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="medicationAdherence"
                  value={medicationAdherence}
                  onChange={(e) => setMedicationAdherence(e.target.value)}
                  placeholder="Medication Adherence:"
                  required
                />
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
              type="button"
              className="btn btn-primary w-25"
              onClick={step === 3 ? handleRegister : handleNext}
            >
              {step === 3 ? "Register" : "Next"}
            </button>
          </div>

          {error && <p className="text-danger mt-3">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
