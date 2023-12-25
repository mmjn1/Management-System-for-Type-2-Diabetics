import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WelcomePage from "./containers/WelcomePage";

import store from "./store.js";

import PatientRegisterPage from "../src/containers/patientContainers/PatientRegisterPage.jsx";
// import PatientLoginPage from './containers/PatientLoginPage.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/welcomePage" element={<WelcomePage />} />
      {/* <Route path="/login" element={<PatientLoginPage/>} />  */}
      <Route path="/" element={<PatientRegisterPage />} />
    </Routes>
  );
};

export default App;
