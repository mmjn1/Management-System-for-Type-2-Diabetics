import React from 'react'
import '../../assets/sass/DoctorDashboard.scss'
import Navbar from '../../components/PostLoginNavigation'
import DoctorSidebar from '../../components/SidebarDoctor'

const DoctorDashboardPage = () => {
  return (
    <div className="home">
        <DoctorSidebar />
        <div className="homeContainer">
          <Navbar />
        </div>
    </div>

  )
}

export default DoctorDashboardPage;