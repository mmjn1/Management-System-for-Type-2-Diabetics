import React from "react";
import { Route, Routes } from "react-router-dom";
import { KThemeProvider } from "./containers/KThemeProvider";
import Main from "./MainR/MainRoute.jsx";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import DashboardLayout from "./layout/PatientLayout";

import BloodSugarPage from "../src/containers/patientContainers/BloodSugarPage";
import DietaryHabits from "../src/containers/patientContainers/DietaryHabits";
import EducationalResources from "../src/containers/patientContainers/EducationalResources";
import PatientAppointmentsPage from "../src/containers/patientContainers/Calendar/Appointments";
import PatientDashboardPage from "../src/containers/patientContainers/PatientDashboardPage";
import PatientPrescriptionsPage from "../src/containers/patientContainers/PatientPrescriptionsPage";
import Profile from "../src/containers/patientContainers/Profile";
import DoctorDashboardPage from "../src/containers/doctorContainers/DoctorDashboardPage";
import DoctorProfile from "../src/containers/doctorContainers/DoctorProfile";
import DoctorLayout from "./layout/DoctorLayout";
import DoctorAppointmentsPage from "../src/containers/doctorContainers/DoctorCalendar/DoctorAppointmentsPage";
import Chat from "./components/Chat";
import ChatComponent from "./components/ChatComponent";
import DoctorChat from "./components/DoctorChat";
import PatientRecords from "../src/containers/doctorContainers/PatientRecords";
import PatientDetailsPage from "./containers/doctorContainers/PatientDetails";
import CustomForms from "./containers/doctorContainers/DynamicForms/CustomForms";
import FormDetail from "./containers/doctorContainers/DynamicForms/FormDetail";
import CreateForm from "./containers/doctorContainers/DynamicForms/CreateForm";
import MyRecords from "../src/containers/patientContainers/MyRecords";


const App = () => {
  return (
    <KThemeProvider>
      <Routes>
        <Route path="/*" element={<Main />} />
        <Route path="/chat" element={<Chat />} />

        <Route path="/patient/dashboard" element={<PatientDashboardPage />} />

        <Route path="/patient/bloodsugar" element={<DashboardLayout> <BloodSugarPage /></DashboardLayout>} />
        <Route path="/diet" element={<DashboardLayout> <DietaryHabits /> </DashboardLayout>} />
        <Route path="/patient/chat" element={<DashboardLayout> {" "} <ChatComponent />{" "} </DashboardLayout>} />
        <Route path="/resources" element={<DashboardLayout> <EducationalResources /> </DashboardLayout>} />
        <Route path="/patient/appointments" element={<DashboardLayout> <PatientAppointmentsPage /> </DashboardLayout>} />
        <Route path="/prescriptions" element={<DashboardLayout> <PatientPrescriptionsPage /> </DashboardLayout>} />
        <Route path="/patient/profile" element={<DashboardLayout> <Profile /> </DashboardLayout>} />
        <Route path="/myrecords" element={<DashboardLayout> <MyRecords /> </DashboardLayout>} />
        
        <Route path="/doctor/appointments" element={<DoctorLayout> <DoctorAppointmentsPage /> </DoctorLayout>} />
        <Route path="/doctor/dashboard" element={<DoctorLayout> <DoctorDashboardPage /> </DoctorLayout>} />
        <Route path="/doctor/profile" element={<DoctorLayout> <DoctorProfile /> </DoctorLayout>} />
        <Route path="/doctor/chat" element={<DoctorLayout> {" "} <DoctorChat />{" "} </DoctorLayout>} />
        <Route path="/doctor/patient-records" element={<DoctorLayout> <PatientRecords /> </DoctorLayout>} />
        <Route path="/doctor/patient-details" element={<DoctorLayout> <PatientDetailsPage /> </DoctorLayout>} />

        <Route path="/doctor/custom-forms" element={<DoctorLayout> <CustomForms /> </DoctorLayout>} />
        <Route path="/forms/create" element={<DoctorLayout> <CreateForm /> </DoctorLayout>} />
        <Route path="/forms/:formId/edit" element={<DoctorLayout> <CreateForm /> </DoctorLayout>} />
        <Route path="/forms/:formId/details" element={<DoctorLayout> <FormDetail /> </DoctorLayout>} />


      </Routes>
    </KThemeProvider>
  );
};

export default App;
