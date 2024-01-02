import React from 'react';
import Sidebar from '../../components/PatientSidebar';
import Navbar from '../../components/PostLoginNavigation';
import "../../assets/sass/PatientDashboard.scss";
import { Link } from 'react-router-dom';

const PatientPrescriptionsPage = () => {
    return (
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="content">
                    {/* Your prescription page content goes here */}
                    Prescriptions Page

                </div>
            </div>
        </div>
    );
}
export default PatientPrescriptionsPage;
