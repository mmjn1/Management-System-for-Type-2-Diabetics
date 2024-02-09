import React from 'react'
import Sidebar from '../../components/PatientSidebar'
import Navbar from '../../components/PostLoginNavigation'
import "../../assets/patientcss/dashboard.css";

const PatientDashboardPage = () => {
  return (
    <div>
      <Navbar/>
      <div className="containers">
        <Sidebar/>
      </div>
        
    </div>

  )
}

export default PatientDashboardPage;