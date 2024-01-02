import React from 'react'
import "../../assets/sass/PatientDashboard.scss"
import Sidebar from '../../components/PatientSidebar'
import Navbar from '../../components/PostLoginNavigation'


import BloodSugarWidget from '../../components/Patientwidgets/BloodSugarWidget'
import PrescriptionsWidget from '../../components/Patientwidgets/PrescriptionsWidget'
import AppointmentsWidget from '../../components/Patientwidgets/AppointmentsWidget'

const PatientDashboardPage = () => {
  return (
    <div className="home">
        <Sidebar />
        <div className="homeContainer">
          <Navbar />
          {/* Grid container for widgets */}

            <div className="widgetGrid">
              {/* Each widget gets a "widgetItem" class for individual styling */}
              <div className="widgetItemB">
                <BloodSugarWidget />
              </div>

              <div className="widgetItemP"> 
                <PrescriptionsWidget />
              </div>

              <div className="widgetItemA">
                <AppointmentsWidget />
              </div>
          
        </div>


        </div>
    </div>

  )
}

export default PatientDashboardPage;