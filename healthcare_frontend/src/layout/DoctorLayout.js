import React from "react";
import SidebarDoctor from "../components/SidebarDoctor";
import "../assets/patientcss/dashboard.css";
import Navbar from "../components/PostLoginNavigation";
import FloatingButton from '../containers/doctorContainers/FloatingButton'

const DoctorLayout = ({ children }) => (
  <>
    <Navbar />
    <div className="containers">
      <div style={{ width: '300px' }}>
        <SidebarDoctor />
      </div>
      {children}
      <FloatingButton />

    </div>
  </>
);

export default DoctorLayout;
