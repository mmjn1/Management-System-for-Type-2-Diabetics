import React from "react";
import Sidebar from "../components/PatientSidebar";
import Navbar from "../components/PostLoginNavigation";
import "../assets/patientcss/dashboard.css";

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="containers">
      <div style={{ width: '300px' }}>
        <Sidebar />
      </div>
      {children}
    </div>
  </>
);

export default Layout;