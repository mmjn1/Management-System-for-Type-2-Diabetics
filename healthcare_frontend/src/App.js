import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./containers/WelcomePage";

import store from "./store.js";

import PatientRegisterPage from "../src/containers/patientContainers/PatientRegisterPage";
import PatientLoginPage from '../src/containers/patientContainers/PatientLoginPage';

const App = () => {
  return (
    <Routes>
      <Route path="/welcomePage" element={<WelcomePage />} />
      <Route path="/login" element={<PatientLoginPage/>} />  
      <Route path="/" element={<PatientRegisterPage />} />
    </Routes>
  );
};

export default App;
