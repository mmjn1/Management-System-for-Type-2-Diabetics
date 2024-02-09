import React from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import "../assets/patientcss/dashboard.css";
import Navbar from "../components/PostLoginNavigation";

const DoctorLayout = ({ children }) => (
    <>
      <Navbar />
      <div className="containers">
        <SidebarDoctor />
        {children}
      </div>
    </>
  );
  
  export default DoctorLayout;