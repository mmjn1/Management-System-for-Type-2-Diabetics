import React from "react";
import { Route, Routes } from "react-router-dom";
import { KThemeProvider } from "./containers/KThemeProvider";
import Main from "./MainR/MainRoute.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import DashboardLayout from "./layout/PatientLayout";

import BloodSugarPage from "../src/containers/patientContainers/BloodSugarPage";
import DietaryHabits from "../src/containers/patientContainers/DietaryHabits";
import EducationalResources from "../src/containers/patientContainers/EducationalResources";
import PatientAppointmentsPage from "../src/containers/patientContainers/Appointments";
import PatientDashboardPage from "../src/containers/patientContainers/PatientDashboardPage";
import PatientPrescriptionsPage from "../src/containers/patientContainers/PatientPrescriptionsPage";
import Profile from "../src/containers/patientContainers/Profile";
import ProgressTracker from "../src/containers/patientContainers/ProgressTracker";
import SurgeryInfo from "../src/containers/SurgeryInfo";
import Payments from "../src/containers/patientContainers/Payments";
import DoctorDashboardPage from "../src/containers/doctorContainers/DoctorDashboardPage";
import DoctorProfile from "../src/containers/doctorContainers/DoctorProfile";
import DoctorLayout from "./layout/DoctorLayout";
import DoctorAppointmentsPage from "../src/containers/doctorContainers/DoctorAppointmentsPage";

const App = () => {
  return (
    <KThemeProvider>
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/patient/dashboard" element={<PatientDashboardPage />} />

        <Route path="/patient/bloodsugar" element={<DashboardLayout> <BloodSugarPage /></DashboardLayout>} />
        <Route path="/diet" element={<DashboardLayout> <DietaryHabits /> </DashboardLayout>} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/resources" element={<EducationalResources />} />
        <Route path="/appointments" element={<DashboardLayout> <PatientAppointmentsPage/> </DashboardLayout>} />
        <Route path="/prescriptions" element={<DashboardLayout> <PatientPrescriptionsPage /> </DashboardLayout>} />
        <Route path="/patient/profile" element={<DashboardLayout> <Profile /> </DashboardLayout>} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/surgery" element={<SurgeryInfo />} />


        <Route path="/doctor/appointments" element={<DoctorLayout> <DoctorAppointmentsPage /> </DoctorLayout>} />
        <Route path="/doctor/dashboard" element={<DoctorLayout> <DoctorDashboardPage /> </DoctorLayout>} />
        <Route path="/doctor/profile" element={<DoctorLayout> <DoctorProfile /> </DoctorLayout>} />
      </Routes>
    </KThemeProvider>
  );
};

export default App;
