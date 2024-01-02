import React from 'react';
import Sidebar from '../../components/PatientSidebar';
import Navbar from '../../components/PostLoginNavigation';
import "../../assets/sass/PatientDashboard.scss";
import { Link } from 'react-router-dom';

const BloodSugarPage = () => {
    return (   
        <div className="home">
            <Sidebar />
            <div className="homeContainer">
                <Navbar />
                <div className="content">
                    {/* Your blood sugar page content goes here */}
                    Blood Sugar Page

                </div>
            </div>
        </div>
    );
}

export default BloodSugarPage;