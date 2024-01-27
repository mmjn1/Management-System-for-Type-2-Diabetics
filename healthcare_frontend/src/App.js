import React from "react";
import { Route, Routes } from "react-router-dom";

import store from "./store.js";
import {KThemeProvider} from "./containers/KThemeProvider";
import Main from "./MainR/MainRoute.jsx";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import BloodSugarPage from "../src/containers/patientContainers/BloodSugarPage";
import DietaryHabits from "../src/containers/patientContainers/DietaryHabits";
import EducationalResources from "../src/containers/patientContainers/EducationalResources";
import PatientAppointmentsPage from "../src/containers/patientContainers/PatientAppointmentsPage";
import PatientDashboardPage from "../src/containers/patientContainers/PatientDashboardPage";
import PatientPrescriptionsPage from "../src/containers/patientContainers/PatientPrescriptionsPage";
import Profile from "../src/containers/patientContainers/Profile";
import ProgressTracker from "../src/containers/patientContainers/ProgressTracker";
import SurgeryInfo from "../src/containers/SurgeryInfo";

import DoctorDashboardPage from "../src/containers/doctorContainers/DoctorDashboardPage";


const App = () => {
  return (
    <KThemeProvider>
        <Routes>
          <Route path="/*" element={<Main />} />
      
          <Route path="/bloodsugar" element={<BloodSugarPage />} />
          <Route path="/diet" element={<DietaryHabits />} />
          <Route path="/resources" element={<EducationalResources />} />
          <Route path="/appointments" element={<PatientAppointmentsPage />} />
          <Route path="/patient/dashboard" element={<PatientDashboardPage />} />
          <Route path="/prescriptions" element={<PatientPrescriptionsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/progress" element={<ProgressTracker />} />
          <Route path="/surgery" element={<SurgeryInfo />} />

          <Route path="/doctor/dashboard" element={<DoctorDashboardPage />} />
          {/* <Route path="/doctor/register" element={<DoctorRegisterPage />} /> */}
          {/* <Route path="/doctor/login" element={<DoctorLoginPage />} /> */}

        </Routes>
    
    </KThemeProvider>
  );
};

export default App;
